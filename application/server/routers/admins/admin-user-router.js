/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
 var express = require("express");
 var router = express.Router();
 const bodyParser = require("body-parser");
 const cors = require("cors");
 const { v4: uuidv4 } = require("uuid");
// Imports the database Models
const Admin = require("../../models/Admin");
const IndividualUser = require("../../models/IndividualUser");
const OrganizationLead = require("../../models/OrganizationLead");
const OrganizationMember = require("../../models/OrganizationMember");
const User = require("../../models/User");
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


// Get all users in the system
router.get("/admins/:adminId/users", async (req, res) => {
  try{
    // Users
    const users = (await findQuery(User)
      .build({}));

    // Table of User subclasses
    const subclassTable = [
      { type: "iUser", model: IndividualUser },
      { type: "orgMember", model: OrganizationMember },
      { type: "orgLead", model: OrganizationLead },
      { type: "admin", model: Admin },
    ];

    // Collect User subclass objects
    for (let i = 0; i < subclassTable.length; i++) {
      const subclassField = subclassTable[i]
      subclassField.objects = await findQuery(subclassField.model).build({})
    }

    // Put all users into a Map
    const userIdMap = {}
    for (let i = 0; i < users.length; i++) {
      userIdMap[users[i].id] = users[i]
    }

    // Place all types into each user
    for (let i = 0; i < subclassTable.length; i++) {
      const subclassField = subclassTable[i]
      const objects = subclassField.objects
      for (let j = 0; j < objects.length; j++) {
        const object = objects[j]
        userIdMap[object.user_id].type = subclassField.type
      }
    }
  
    // Send the list of users
    return res.send([...users]);

  }catch(error){
    console.dir(error);
    return res.send(500,json({
      message: "Internal Error"
    }))
  }
});

// Delete all users in the system
router.delete("/admins/:adminId/users/:userId", async (req, res) => {
  try{
    console.log(JSON.stringify(req.params))
    console.log(JSON.stringify(req.body))

    const doc = await User.query().delete().where("id", req.params.userId).first();
  
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