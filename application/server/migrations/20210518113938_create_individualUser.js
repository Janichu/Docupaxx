

exports.up = function (knex) {
    return knex.schema.createTable("individualUser", (table) => {
      table
        .uuid("id")
        .primary();

      table
        .uuid("user_id")
        .notNullable()
        .references("user.id")
        .onDelete("CASCADE");
    });
  };
  
  // Drop the table
  exports.down = function (knex) {
     return knex.schema.dropTable("individualUser");
    
  }
