
exports.up = function(knex) {
    return knex.schema.table("organization", (table) => {
        table
            .timestamp('last_charged');
            
    });
};

exports.down = function(knex) {
    return knex.schema.table("organization", (table) => {
        table.dropColumn('last_charged');
    });
};
