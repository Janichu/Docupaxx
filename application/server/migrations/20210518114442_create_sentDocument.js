
exports.up = function(knex) {
    return knex.schema.createTable("sentDocument", (table) => {
        table
            .uuid("id")
            .primary();
        
        table
            .string("name", 255)
            .notNullable();
        
        table
            .string("description", 255);

        table.uuid("sentPackage_id")
            .notNullable()
            .references("sentPackage.id")
            .onDelete("CASCADE");


        table
            .string("url",255)
            .notNullable();
            
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("sentDocument");
};

