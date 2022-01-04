const { Model } = require("objection");

module.exports = class SentPackage extends Model {
  
  // Method to get table name
  static get tableName() {
    return "sentPackage";
  }
  static get relationMappings() {
    const IndividualUser = require("./IndividualUser");
    const Organization = require("./Organization");
    return {
      arp: {
        relation: Model.HasOneRelation,
        modelClass: IndividualUser,
        join: {
          from: "user_id",
          to: "individualUser.id"
        },
      },
      org: {
        relation: Model.HasOneRelation,
        modelClass: Organization,
        join: {
          from: "organization_id",
          to: "organization.id"
        },
      },
    };
  }
};