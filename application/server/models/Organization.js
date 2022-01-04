/**
 * Organization.js - This file represents all methods and relationships for the Organization table
 */
 const { Model } = require("objection");

 module.exports = class OrganizationTest extends Model {
   
   // Method to get table name
   static get tableName() {
     return "organization";
   }
 
   // Relationship with other tables
   static get relationMappings() {
     const Address = require("./Address");
     return {
       address: {
           relation: Model.HasOneRelation,
           modelClass: Address,
           join:{
               from: "address_id",
               to: "address.id",
           }
       },
     };
   }
 };
 