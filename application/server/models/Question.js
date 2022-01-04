const { Model } = require("objection");

module.exports = class Question extends Model {
  
  // Method to get table name
  static get tableName() {
    return "question";
  }
  static get relationMappings() {
    const Quiz = require("./Quiz");
    return {
      quiz: {
        relation: Model.BelongsToOneRelation, 
        modelClass: Quiz,
        join: {
          from: "quiz_id",
          to: "quiz.id"
        },
      },
    };
  }
};