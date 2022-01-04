const { Model } = require("objection");

module.exports = class Document extends Model {
  
  // Method to get table name
  static get tableName() {
    return "document";
  }
  static get relationMappings() {
    const Package = require("./Package");
    return {
      package: {
        relation: Model.BelongsToOneRelation, 
        modelClass: Package,
        join: {
          from: "package_id",
          to: "package.id"
        },
      },
    };
  }
};