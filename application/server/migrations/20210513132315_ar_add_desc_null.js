
exports.up = function(knex) {
    return knex.schema.table("ar", (table) => {
        table.string('description', 255);
    });
};

exports.down = function(knex) {
    return knex.schema.table("ar", (table) => {
        table.dropColumn('description');
    });
};
