
exports.up = function(knex) {
    return knex.schema.table("ar", (table) => {
        table.dropColumn('description')
    });
};

exports.down = function(knex) {
    return knex.schema.table("ar", (table) => {
        table.string('description', 255).nonNullable();
    });
};
