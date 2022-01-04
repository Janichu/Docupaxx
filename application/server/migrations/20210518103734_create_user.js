 // Create the table
 exports.up = function (knex) {
    return knex.schema.createTable("user", (table) => {
      table
        .uuid("id")
        .primary();

      table
        .string("username", 255)
        .notNullable()
        .unique();

      table
        .string("email", 255)
        .notNullable()
        .unique();

      table
        .string("password", 255)
        .notNullable();

      table
        .boolean("is_enabled")
        .defaultTo(false);

      table
        .string("image", 255)

      table
        .string("thumbnail", 255)
        
      table.timestamps(true, true);
    });
  };
  
  // Drop the table
  exports.down = function (knex) {
     return knex.schema.dropTable("user");
    
  };
