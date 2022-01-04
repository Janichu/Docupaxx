const { Model } = require("objection");

module.exports = class ForeignReferencingQuestion extends Model {
  
  // Method to get table name
  static get tableName() {
    return "foreignReferencingQuestion";
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