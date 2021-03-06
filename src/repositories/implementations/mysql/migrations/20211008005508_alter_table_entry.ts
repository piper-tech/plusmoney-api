import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('entries', (table) => {
    table.integer('categoryId').unsigned().references('id').inTable('categories');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('entries', (table) => {
    table.dropForeign('categoryId');
    table.dropColumn('categoryId');
  });
}
