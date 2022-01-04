const { Model } = require("objection");

module.exports = class SelfReferencingQuestion extends Model {
  
  // Method to get table name
  static get tableName() {
    return "selfReferencingQuestion";
  }
  static get relationMappings() {
    const Question = require("./Question");
    return {
      quiz: {
        relation: Model.BelongsToOneRelation, 
        modelClass: Question,
        join: {
          from: "question_id",
          to: "question.id"
        },
      },
    };
  }
};