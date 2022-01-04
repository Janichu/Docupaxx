
exports.up = function(knex) {
    return knex.schema.createTable("insuranceOrganization", (table)=> {
        table.uuid("id")
            .primary();
            
        table.uuid("organization_id")
            .notNullable()
            .references("organization.id")
            .onDelete("CASCADE");
        
    });
  
};

exports.down = function(knex) {
    return knex.schema.dropTable("insuranceOrganization");
};

