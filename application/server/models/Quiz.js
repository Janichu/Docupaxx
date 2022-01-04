const { Model } = require("objection");

module.exports = class Quiz extends Model {
  static get tableName() {
    return "quiz";
  }
};