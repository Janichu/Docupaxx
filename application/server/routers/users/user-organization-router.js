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
  

 /************************************
  * API ROUTES
  ***********************************/
 

//Gets all the organizations
router.get("/users/:userId/organizations", async (req, res) => {
  console.log("Gets orgainizations")
  // Perform search query using the searched item from the nav/search bar
  const organizations = await findQuery(Organization)
    .build(req.query)
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    })
    
  // Respond with the search result
  return res.send(organizations);
});
  



  module.exports = router;