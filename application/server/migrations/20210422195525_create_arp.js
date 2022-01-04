
exports.up = function(knex) {
    return knex.schema.createTable("arp", (table) => {
        table
            .uuid("id")
            .primary();

        table
            .string("name", 255)
            .notNullable();

        table
            .string("description", 255)
            .notNullable();

        table.uuid("organization_id", 255)
            .notNullable()
            .references("organization.id")
            .onDelete("CASCADE");

        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("arp");
};
