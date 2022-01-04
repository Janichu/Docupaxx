
exports.up = function(knex) {
    return knex.schema.table("organization", (table) => {
        table.string('description', 255);
    });
};

exports.down = function(knex) {
    return knex.schema.table("organization", (table) => {
        table.dropColumn('description');
    });
};
