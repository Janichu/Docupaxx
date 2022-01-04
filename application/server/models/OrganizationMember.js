const { Model } = require("objection");

module.exports = class OrganizationMember extends Model {
  static get tableName() {
    return "organizationMember";
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