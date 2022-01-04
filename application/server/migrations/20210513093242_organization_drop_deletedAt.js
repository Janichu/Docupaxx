
exports.up = function(knex) {
    return knex.schema.alterTable("organization", (table)=>{ 
        table
            .dropColumn("deleted_at")
      });
  };
  
  exports.down = function(knex) {

  };
