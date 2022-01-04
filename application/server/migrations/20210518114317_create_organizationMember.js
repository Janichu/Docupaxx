
exports.up = function(knex) {
    return knex.schema.createTable("organizationMember", (table) => {
        table
            .uuid("id")
            .primary();

        table
            .uuid("user_id")
            .notNullable()
            .references("user.id")
            .onDelete("CASCADE");

        table
            .uuid("organization_id")
            .notNullable()
            .references("organization.id")
            .onDelete("CASCADE");

    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("organizationMember");
};
