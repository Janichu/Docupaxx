/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
 var express = require("express");
 var router = express.Router();
 const bodyParser = require("body-parser");
 const cors = require("cors");
 const { v4: uuidv4 } = require("uuid");
// Imports the database Models
const Organization = require("../../models/Organization");
const SentPackage = require("../../models/SentPackage");
//
const { findQuery } = require("objection-find");
 
 
router.use(bodyParser.json());
router.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
 
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
   console.log("Time: ", Date.now());
   next();
 });
 
 // Get a SentPackage of an Organization
router.get("/organizations/:organizationId/sentPackages/:sentPackageId", async (req,res)=>{
  const sentPackage = await SentPackage.query()
    .where("organization_id", req.params.organizationId)
    .where("id", req.params.sentPackageId)
    .first()
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    });
  
  return res.send(sentPackage);
})

 // Get all SentPackages of an Organization
router.get("/organizations/:organizationId/sentPackages", async(req,res)=>{
    console.log("Hello")
  const sentPackages = await SentPackage.query()
    .where("organization_id", req.params.organizationId)
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    });
  console.dir(sentPackages)
  return res.send(sentPackages);
})




  
  module.exports = router;