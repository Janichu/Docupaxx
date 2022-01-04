const { Model } = require("objection");

module.exports = class ARP extends Model {
  
  // Method to get table name
  static get tableName() {
    return "arp";
  }
  static get relationMappings() {
    const AR = require("./AR");
    const Organization = require("./Organization");
    return {
      organization: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organization,
        join: {
            from: "organization_id",
            to: "organizationTest.id"
        },
      }
    };
  }
};