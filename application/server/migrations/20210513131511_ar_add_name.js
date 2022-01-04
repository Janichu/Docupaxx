
exports.up = function(knex) {
    return knex.schema.table("ar", (table) => {
        table.string('name', 255)
            .notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table("ar", (table) => {
        table.dropColumn('name');
    });
};
