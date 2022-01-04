const { Model } = require("objection");

module.exports = class Address extends Model {
  
  // Method to get table name
  static get tableName() {
    return "address";
  }
};