
exports.up = function(knex) {
    return knex.schema.alterTable("organization", (table)=>{ 
        table
            .dropColumn("type")        
      });
  };
  
  exports.down = function(knex) {

  };
