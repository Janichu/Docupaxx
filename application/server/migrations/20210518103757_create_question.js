
 exports.up = function (knex) {
    return knex.schema.createTable("question", (table) => {
      table
        .uuid("id")
        .primary();

      table
        .uuid("quiz_id", 255)
        .notNullable()
        .references("quiz.id")
        .onDelete("CASCADE");

      table
        .string("answerType", 255)
        .notNullable();

      table
        .string("parentUrlKey", 255).
        notNullable();

      table
        .string("parentTable", 255)
        .notNullable();

      table
        .string("currentTable", 255)
        .notNullable();

      table
        .string("currentField", 255)
        .notNullable();

      table
        .string("currentUrlKey", 255)
        .notNullable();

      table
        .timestamp("last_charged");

      table
        .timestamps(true, true);
      
    });
  };
  
  // Drop the table
  exports.down = function (knex) {
     return knex.schema.dropTable("question");
    
  };

