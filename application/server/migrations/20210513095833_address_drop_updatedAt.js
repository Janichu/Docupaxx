
exports.up = function(knex) {
    return knex.schema.alterTable("address", (table)=>{ 
        table
            .dropColumn("updated_at")
      });
  };
  
exports.down = function(knex) {

};
