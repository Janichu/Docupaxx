const { Model } = require("objection");

module.exports = class AR extends Model {
  static get tableName() {
    return "ar";
  }
  static get relationMappings() {
    const ARP = require("./ARP");
    return {
      arp: {
        relation: Model.BelongsToOneRelation,
        modelClass: ARP,
        join: {
          from: "arp_id",
          to: "arp.id"
        },
      },
    };
  }
};