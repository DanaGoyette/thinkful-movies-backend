/** @param {import('knex')} knex */
exports.up = function (knex) {
    return knex.schema.createTable("critics", (table) => {
      table.increments("critic_id");
      table.string("preferred_name");
      table.string("surname");
      table.string("organization_name");
      table.timestamps(true, true);
    });
  };
  
  /** @param {import('knex')} knex */
  exports.down = function (knex) {
    return knex.schema.dropTable("critics");
  };