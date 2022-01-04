
exports.up = function(knex) {
    return knex.schema.createTable("package", (table) => {
        table
            .uuid("id")
            .primary();

        table
            .uuid("user_id")
            .references("individualUser.id")
            .notNullable()
            .onDelete("CASCADE")

        table
            .string("name", 255)
            .notNullable();
        table
            .string("description", 255);
        
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("package");
};
