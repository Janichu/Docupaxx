/**
 * knexfile - This file will be used to create the connection to the database
 */
module.exports = {
  // Initialize knex
  development: {
    client: "mysql2",
    connection: {
      host: "database-1.chqapgcmnusy.us-west-1.rds.amazonaws.com",
      user: "admin",
      password: "DocupaxxTeam7#",
      database: "team7database",
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
