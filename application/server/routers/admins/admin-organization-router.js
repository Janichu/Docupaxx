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
//
const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require('multer');
const bcrypt = require('bcrypt')
 
const { route } = require("../../web-router");
//storage of the files
const storage = multer.diskStorage({
  //changes the location of the uploads
  destination: function (req, file, cb) {
    cb(null, "../../uploads/");
  },
  //changes the way the files are named
  filename: function (req, file, cb) {
   //.replace(/:/g, '-') is needed for Windows because it doesn't let you create
   //files with a colon (:).
   cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
 
//upload the image to the server
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
 
router.use(bodyParser.json());
router.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
 
// Middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
 

/******************************************************************
* MAIN USER METHODS
*****************************************************************/


// Get all organizations in the system
router.get("/admins/:adminId/organizations", async (req, res) => {
    try{
      // Perform search query using the searched item from the nav/search bar
      const organizations = await findQuery(Organization)
        .build(req.query);
    
      // Respond with the search result
      return res.send(organizations);
     } catch(error){
        console.dir(error);
    
        return res.send(500,json({
          message: "Internal Error"
        }))
      }
});

// Patches an organization in the system
router.patch("/admins/:adminId/organizations/:organizationId", async (req, res) => {
  try{
    console.log(JSON.stringify(req.params))
    console.log(JSON.stringify(req.body))

    const organization = await Organization.query()
      .patch(req.body)
      .findById(req.params.organizationId);
  
    // Respond with the search result
    return res.send({});
   } 
   catch(error){
      console.dir(error);
  
      return res.send(500,json({
        message: "Internal Error"
      }))
    }
});

// Delete all organizations in the system
router.delete("/admins/:adminId/organizations/:organizationId", async (req, res) => {
  try{
    console.log(JSON.stringify(req.params))
    console.log(JSON.stringify(req.body))

    const doc = await Organization.query().delete().where("id", req.params.organizationId).first();
  
    // Respond with the search result
    return res.send({});
   } 
   catch(error){
      console.dir(error);
  
      return res.send(500,json({
        message: "Internal Error"
      }))
    }
});












module.exports = router;