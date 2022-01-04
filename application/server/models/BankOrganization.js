const { Model } = require("objection");

module.exports = class BankOrganization extends Model {
  
  // Method to get table name
  static get tableName() {
    return "bankOrganization";
  }
  static get relationMappings() {
    const Organization = require("./Organization");
    return {
      org: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organization,
        join: {
          from: "organization_id",
          to: "organization.id"
        },
      },
    };
  }
};