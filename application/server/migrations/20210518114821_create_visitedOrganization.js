
  exports.up = function (knex) {
    return knex.schema.createTable("visitedOrganizations", (table) => {
      table
        .uuid("id")
        .primary();

      table
        .uuid("organization_id")
        .references("organization.id")
        .onDelete("CASCADE");

      table
        .uuid("individualUser_id")
        .references("individualUser.id")
        .onDelete("CASCADE");
    
      table.timestamps(true, true);
      
    });
  };
  
  
   // Drop the table
  exports.down = function (knex) {
    return knex.schema.dropTable("visitedOrganizations");
  };
