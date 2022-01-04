
exports.up = function(knex) {
    return knex.schema.createTable("document", (table) => {
        table
            .uuid("id")
            .primary();
        
        table
            .string("name", 255)
            .notNullable();
        
        table
            .string("description", 255);    

        table
            .uuid("package_id")
            .notNullable()
            .references("package.id")
            .onDelete("CASCADE")

        table
            .string("url", 255)
            .notNullable();
            
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("document");
};
