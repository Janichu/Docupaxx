
exports.up = function(knex) {
  return knex.schema.createTable("ar", (table) => {
    table
      .uuid("id")
      .primary();
    
    table
      .string("description", 255)
      .notNullable();

    table.uuid("arp_id")
      .notNullable()
      .references("arp.id")
      .onDelete("CASCADE")
      
    table.timestamps(true, true);

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("ar");
};
