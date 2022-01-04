
exports.up = function(knex) {
    return knex.schema.alterTable("address", (table)=>{ 
        table
            .dropColumn("deleted_at")
      });
  };
  
exports.down = function(knex) {

};
