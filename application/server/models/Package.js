const { Model } = require("objection");

module.exports = class Package extends Model {
  
  // Method to get table name
  static get tableName() {
    return "package";
  }
  static get relationMappings() {
    const IndividualUser = require("./IndividualUser");
    return {
      arp: {
        relation: Model.BelongsToOneRelation, 
        modelClass: IndividualUser,
        join: {
          from: "user_id",
          to: "individualUser.id"
        },
      },
    };
  }
};