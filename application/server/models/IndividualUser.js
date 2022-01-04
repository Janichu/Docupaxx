const { Model } = require("objection");

module.exports = class IndividualUser extends Model {
  static get tableName() {
    return "individualUser";
  }

  static get relationMappings() {
    const User = require("./User");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_id",
          to: "user.id"
        },
      },
    };
  }
};