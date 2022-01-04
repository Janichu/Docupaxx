
exports.up = function(knex) {
    return knex.schema.createTable("otherOrganization", (table)=> {
        table
            .uuid("id")
            .primary();

        table
            .uuid("organization_id")
            .notNullable()
            .references("organization.id")

        table
            .string("type", 255)
            .notNullable();
    });
  
};

exports.down = function(knex) {
    return knex.schema.dropTable("otherOrganization");
};
