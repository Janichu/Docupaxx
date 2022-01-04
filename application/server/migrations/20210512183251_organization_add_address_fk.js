exports.up = function(knex) {
    return knex.schema.alterTable("organization", (table)=>{
        table
            .foreign("address_id")
            .references("address.id")
            .onDelete("SET NULL")  
      });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable("organization", (table)=>{
        
        table
            .dropForeign("address_id");
  
    })
  };