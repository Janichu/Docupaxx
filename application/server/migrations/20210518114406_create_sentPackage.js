
exports.up = function(knex) {
    return knex.schema.createTable("sentPackage", (table) => {
        table
            .uuid("id")
            .primary();
       
        table
            .string("name", 255)
            .notNullable()
        
        table
            .string("description", 255)

        table
            .boolean("archived")
            .defaultTo(false)
        
        table
            .uuid("user_id")
            .references("individualUser.id")
            .onDelete("SET NULL")

        table
            .uuid("organization_id")
            .references("organization.id")
            .onDelete("SET NULL")
        
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("sentPackage");
};
