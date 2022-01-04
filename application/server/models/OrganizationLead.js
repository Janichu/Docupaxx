const { Model } = require("objection");

module.exports = class OrganizationLead extends Model {
  static get tableName() {
    return "organizationLead";
  }

  static get relationMappings() {
    const User = require("./User");
    const Organization = require("./Organization")
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user_id",
          to: "user.id"
        },
      },
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