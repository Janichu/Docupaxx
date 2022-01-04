/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
 var express = require("express");
 var router = express.Router();
 const bodyParser = require("body-parser");
 const cors = require("cors");
 const { v4: uuidv4 } = require("uuid");
 
// Imports the database Models
const AR = require("../../models/AR");
const ARP = require("../../models/ARP");
//
const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require('multer');
const { route } = require("../../web-router");
const { DataError, DBError } = require("objection");

// Storage of the files
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
 
/***************************************************************
 * MAIN ApplicationRequirement METHODS
*****************************************************************/

// Get an AR for an ARP (& Org)
router.get("/organizations/:orgId/ars/:arpId/:arId", async (req, res) => {
  const ar = await AR.query()
    .where("id", req.params.arId)
    .first()
    .catch((error)=>{
      console.dir(error);

      return res.send(500, json({
        message: "Internal Error"
      }));
    })

  return res.send({...ar, name: ar.description})
});

// Get all ARs for an ARP (& Org)
router.get("/organizations/:orgId/ars/:arpId", async (req, res) => {
  try{
    const arp = await ARP.query()
      .where("id", req.params.arpId)
      .first()
  
    const ars = await AR.query()
      .where("arp_id", arp.id)

    return res.send(ars)
  }catch(error){
    console.dir(error);

    return res.send(500, json({
      message: "Internal Error"
    }))
  }
});

// Create an AR for an ARP (& Org)
router.post("/organizations/:orgId/ars/:arpId", async (req, res) => {
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

    // Get ARP (Validate arpId)
    const arp = await ARP.query()
      .where("id",req.params.arpId)
      .first();
    
    //Check if the AR name already exists in the ARP
    const checkARs = await AR.query()
      .where("arp_id", req.params.arpId)
      .where("name", req.body.name)
      .count();

    // Retrieves the number of name matches from the query.
    const sameNameARs = Object.keys(checkARs[0])[0];
    const count = checkARs[0][sameNameARs];

    // If the returned value is greater than 0, it means the AR name already exists inside the AR
    if(count > 0){
      throw DBError;
    }

    //uploads the documents
    const ar = await AR.query()
      .insert({
        id: uuidv4(),
        name: req.body.name,
        description: req.body.description,
        arp_id: arp.id
      });
      
    return res.send({});
  }catch(error){
    console.log(error);
    return res.status(500).json({
        message:'Internal Error'
    })
  }
});

// update the AR name and description by matching the parameter arId to one in the database
router.patch("/organizations/:orgId/ars/:arpId/:arId", async (req, res) => {
  
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
    
    // Checks the AR table for any AR with the specified name inside the ARP
    const checkARs = await AR.query()
      .where("arp_id", req.params.arpId)
      .where("name",req.body.name)
      .count();

    // Retrieves the number of name matches from the query.
    const sameNameARs = Object.keys(checkARs[0])[0];
    const count = checkARs[0][sameNameARs];

    // Checks if the name already exists
    if(count > 0){
      throw DBError;
    }

    // If the returned value is greater than 0, it means the AR name already exists inside the ARP
    const doc = await AR.query()
      .patch({ 
        name: req.body.name, 
        description: req.body.description 
      })
      .findById(req.params.arId)
      .catch((error)=>{
        console.dir(error);
        return res.send(500, json({
          message: "Internal Error"
        }))
      })
    return res.send({})
  }catch(error){
    console.log(error);

    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

// Delete an AR
router.delete("/organizations/:orgId/ars/:arpId/:arId", async (req, res) => {
  try{
    //deletes the document
    const ar = await AR.query()
      .deleteById(req.params.arId);
    console.log(ar);
    return res.send(JSON.stringify(ar));
  }catch(error){
    console.log(error);

    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

module.exports = router;