
 exports.up = function (knex) {
    return knex.schema.createTable("quiz", (table) => {
      table
        .uuid("id")
        .primary();

      table
        .string("description", 255)
        .notNullable();

      table.timestamps(true, true);
    });
  };
  
  // Drop the table
  exports.down = function (knex) {
     return knex.schema.dropTable("quiz");
    
  };
