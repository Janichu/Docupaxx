const { Model } = require("objection");

module.exports = class SentDocument extends Model {
  
  // Method to get table name
  static get tableName() {
    return "sentDocument";
  }
  static get relationMappings() {
    const SentPackage = require("./SentPackage");
    return {
      arp: {
        relation: Model.BelongsToOneRelation,
        modelClass: SentPackage,
        join: {
          from: "sent_package_id",
          to: "sentPackage.id"
        },
      },
    };
  }
};