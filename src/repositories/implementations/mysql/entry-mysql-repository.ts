import { EntryData } from '@/entities/data-transfer-objects';
import {
  EntryRepository,
  EntrySaveResponse,
  EntryGenericResponse,
  EntryUpdateResponse,
  EntryDeleteResponse
} from '@/repositories';
import { SaveError } from '@/repositories/errors';
import { left, right } from '@/shared';
import { GetEntryData } from '@/usecases/get-entry';
import knex from './knex';

export class EntryMysqlRepository implements EntryRepository {
  async save(data: EntryData): Promise<EntrySaveResponse> {
    try {
      await knex('entries').insert(data);
      return right(data);
    } catch (error) {
      console.log(error);
      return left(new SaveError((error as Error).message));
    }
  }

  async find(data: GetEntryData): Promise<EntryGenericResponse> {
    const dataDate = { startDate: data.startDate, endDate: data.endDate };
    delete data.startDate;
    delete data.endDate;
    let entries: EntryData[];
    if (dataDate.startDate && dataDate.endDate) {
      entries = await knex('entries')
        .select<EntryData[]>()
        .where(data)
        .whereBetween('date', [dataDate.startDate, dataDate.endDate])
        .orderBy('date', 'desc');
    } else {
      entries = await knex('entries').select<EntryData[]>().where(data).orderBy('date', 'desc');
    }
    if (entries.length === 0) {
      return left(new Error());
    }
    entries.forEach(entry => {
      if (entry.value < 0) {
        entry.type = 'output';
      } else {
        entry.type = 'entry';
      }
    });
    return right(entries);
  }

  async update(data: EntryData): Promise<EntryUpdateResponse> {
    try {
      const affected = await knex('entries').where('id', '=', data.id as number).update(data);
      if (affected === 0) {
        return left(new Error('Entry not found'));
      }
      return right(data);
    } catch (error) {
      console.log(error);
      return left(new Error());
    }
  }

  async delete(id: number): Promise<EntryDeleteResponse> {
    try {
      await knex('entries').where('id', '=', id).del();
      return right(id);
    } catch (error) {
      console.log(error);
      return left(new Error());
    }
  }
}
