/**
 * 20210326234841_organization - This file represents the Organization table. All of information needed
 *                                           for creating the table should be included here
 */

  // Create the table
  exports.up = function(knex) {
    return knex.schema.createTable("organization", (table) => {
        table
          .uuid("id")
          .primary();

        table
          .string("name", 255)
          .notNullable()
          .unique();

        table
          .string("address", 255)
          .notNullable();

        table
          .string("type", 255)
          .notNullable();

        table
          .string("image", 255)
          .notNullable();

        table
          .string("thumbnail", 255)
          .notNullable();
        
        table
          .boolean("is_approved")
          .defaultTo(false);
        
        table.timestamps(true, true);
        table.timestamp("deleted_at");
      });
};

// Drop the table
exports.down = function(knex) {
    return knex.schema.dropTable("organization");
};