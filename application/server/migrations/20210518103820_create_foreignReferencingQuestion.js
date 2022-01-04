
 exports.up = function (knex) {
    return knex.schema.createTable("foreignReferencingQuestion", (table) => {
      table
        .uuid("id")
        .primary();

      table
        .uuid("question_id", 255)
        .notNullable()
        .references("question.id")
        .onDelete("CASCADE");

      table
        .string("referencedField", 255)
        .notNullable()

      table
        .string("referencingField", 255)
        .notNullable();
      
    });
  };
  
  // Drop the table
  exports.down = function (knex) {
     return knex.schema.dropTable("foreignReferencingQuestion");
    
  };
