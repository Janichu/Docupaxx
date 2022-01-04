
 exports.up = function (knex) {
    return knex.schema.createTable("selfReferencingQuestion", (table) => {
      table
        .uuid("id")
        .primary();
        
      table
        .uuid("question_id", 255)
        .notNullable()
        .references("question.id")
        .onDelete("CASCADE");
      
    });
  };
  
  // Drop the table
  exports.down = function (knex) {
     return knex.schema.dropTable("selfReferencingQuestion");
    
  };
