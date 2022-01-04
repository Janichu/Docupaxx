
exports.up = function(knex) {
    return knex.schema.table("question", (table) => {
        table.string('question', 255)
            .notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table("question", (table) => {
        table.dropColumn('question');
    });
};
