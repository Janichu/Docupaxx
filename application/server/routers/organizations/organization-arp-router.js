/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
 
// Imports the database Models
const ARP = require("../../models/ARP");
const Organization = require("../../models/Organization");
//
const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require('multer');
const { DataError, DBError } = require("objection");

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

// Helper method that validates Organization id
const validateOrganizationId = async(id) => {
  const org = await Organization.query()
    .where("id", id)
    .first()
  return org.id
}


/***************************************************************
 * MAIN ApplicationPackageRequirement METHODS
*****************************************************************/


// Get an ARP of an Organization 
router.get("/organizations/:orgId/arps/:arpId",  async (req, res) => {
  const orgId = await validateOrganizationId(req.params.orgId)
  const arps = await ARP.query()
    .where("organization_id", orgId)
    .where("id", req.params.arpId)
    .first()
    .catch((error)=>{
      console.dir(error);
      return res.send(500, json({
        message: "Internal Error"
      }))
    })

  return res.send(arps)
});

// Get all ARPs of an Organization
router.get("/organizations/:orgId/arps",  async (req, res) => {
  const orgId = await validateOrganizationId(req.params.orgId)
  const arps = await ARP.query()
    .where("organization_id", orgId)
    .catch((error) =>{
      console.dir(error);

      return res.send(500, json({
        message: "Internal Error"
      }))
    });

 return res.send(arps);
});

// Get all ARP for an Organization (given org name)
router.get("/organizations/getbyname/:orgName/arps",  async (req, res) => {
   
  // Get the Organization
  const org = await Organization.query()
    .where("name", req.params.orgName)
    .first()
    .catch((error)=>{
      console.dir(error);

      return res.send(500,json({
        message: "Internal Error"
      }))
    })
  
  // Get ARPs of the Organization
  const arps = await ARP.query()
    .where("organization_id", org.id)
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    })
  
  return res.send(arps)
});

// Create an ARP
router.post("/organizations/:orgId/arps/", async (req, res) => {
  // initialize the condition for the name of the doc, which is must be more 3 characters in the field
  const docSchema = Joi.object().keys({
    name: Joi.string().min(3).max(255).required(),
  });
  // execute the validate with Joi
  const result = docSchema.validate({name:req.body.name})
  if (result.error) {
    return res.status(400).json({
      message: "Request error",
    });
  }

  try{
    // Save the paremeter values
    const organizationID = await validateOrganizationId(req.params.orgId) 
  
    // Get ARP info
    const arpName = req.body.name;
    const arpDesc = req.body.description;
  
    //Check if the ARP name already exists in the database
    const checkARPs = await ARP.query()
      .where("name" , req.body.name)
      .count();
  
    // Retrieves the number of name matches from the query.
    const sameNameARPs = Object.keys(checkARPs[0])[0];
    const count = checkARPs[0][sameNameARPs];
  
    // If the returned value is greater than 0, it means the ARP name already exists
    if(count > 0){
      throw DBError;  
    }
    
    // Insert the ARP if it does not exist
    const insertArp = await ARP.query()
      .insert({
        id: uuidv4(),
        name: arpName,
        organization_id: organizationID,
        description: arpDesc,
      })
    return res.send(insertArp);
  }catch(error){
    console.log(error);
    return res.status(500).json({
        message:'Internal Error'
    })
  }
});
 
//update the ARP name and description by matching the parameter arId to one in the database
router.patch("/organizations/:orgId/arps/:arpId", async (req, res) => {
  // initialize the condition for the name of the doc, which is must be more 3 characters in the field
  const docSchema = Joi.object().keys({
    name: Joi.string().min(3).max(255).required(),
  });
  // execute the validate with Joi
  const result = docSchema.validate({name:req.body.name})
  if (result.error) {
    return res.status(400).json({
      message: "Request error",
    });
  }  
  try{
    
    //Check if the ARP name already exists
    const checkARPs = await ARP.query()
    .where("name" , req.body.name)
    .count();

    // Retrieves the number of name matches from the query.
    const sameNameARPs = Object.keys(checkARPs[0])[0];
    const count = checkARPs[0][sameNameARPs];

    // If the returned value is greater than 0, it means the ARP name already exists
    if(count > 0){
      throw DBError;  
    }

    //If the arpId doesn't match with any in the database, throw an error.
    const arp = await ARP.query()
      .patch(req.body)
      .findById(req.params.arpId) ;
    return res.send({});
  }catch(error){
    console.log(error);
    return res.status(500).json({
        message:'Internal Error'
    })
  }
});

// Remove an organization's ARP 
router.delete("/organizations/:organizationId/arps/:arpId/", async (req, res) => {
  // Save the paremeter values
  const arpID = req.params.arpId;
  
  try{
    // Get delete ARP from  and description
    const query = await ARP.query()
      .deleteById(arpID); 

    return res.send(JSON.stringify(query)); // query is the number or rows affected (int)
    
  }catch(error){
    console.dir(error);
    
    return res.status(500).json({
      message:'Internal Error'
    });
  }
});


module.exports = router;