
exports.up = function(knex) {
    return knex.schema.createTable("address", (table) => {
        table.uuid("id").primary();
        table.string("street", 255).notNullable();
        table.string("city",255).notNullable();
        table.string("country",255).notNullable();
        table.string("zip",255).notNullable();
        table.timestamps(true, true);
        table.timestamp("deleted_at");
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("address");
};
