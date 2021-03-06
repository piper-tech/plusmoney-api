import { Entry } from '@/entities';
import { EntryData } from '@/entities/data-transfer-objects';
import { EntryRepository } from '@/repositories';
import { left, right } from '@/shared';
import { UpdateEntryResponse } from './update-entry-response';

export class UpdateEntryUseCase {
  private entryRepository: EntryRepository;

  constructor(entryRepository: EntryRepository) {
    this.entryRepository = entryRepository;
  }

  async execute(data: EntryData): Promise<UpdateEntryResponse> {
    const entryOrError = Entry.create(data.description, data.value, data.date);
    if (entryOrError.isLeft()) {
      return left(entryOrError.value);
    }
    if (!data.id) {
      return left(new Error('entry id not provided'));
    }
    data.date = entryOrError.value.date;
    data.value = entryOrError.value.entryValue;
    await this.entryRepository.update(data);
    delete data.id;
    return right(data);
  }
}
