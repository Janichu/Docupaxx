
exports.up = function(knex) {
    return knex.schema.table("question", (table) => {
        table.string('parentField', 255)
            .notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table("question", (table) => {
        table.dropColumn('parentField');
    });
};
