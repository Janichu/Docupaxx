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
const Document = require("../../models/Document");
const IndividualUser = require("../../models/IndividualUser");
const Organization = require("../../models/Organization");
const Package = require("../../models/Package");
//

const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require('multer');
const { route } = require("../../web-router");
const { Organizations } = require("aws-sdk");
const { DataError, DBError } = require("objection");
const User = require("../../models/User");

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
 
 
 
// Search for a user's packages
router.get("/users/:userId/packages/search", async (req, res) => {
  //finds all packages that fulfill the query
  const packs = await findQuery(Package)
    .build(req.query)
    .where("user_id", req.params.userId)
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    })
  // Respond with the search result
  res.send(packs);
});
    

// Get the list of packages the user has
router.get("/users/:userId/packages/", async (req, res) => {
  console.log("req: " + JSON.stringify(Object.keys(req)))
  console.log("session1: " + JSON.stringify(req.session))
  console.log("session2: " + JSON.stringify(req.session))
  console.log("id: " + req.sessionID)
  //checks the package table for the user's packages
  const packages = await Package.query()
    .where("user_id", req.params.userId)
    .catch((error)=>{
      console.dir(error);
      return res.send(500, json({
        message: "Internal Error"
      }))
    })

  //returns the list of packages
  res.send(packages);
});
  

// Get the specific package to edit
router.get("/users/:userId/packages/:id", async (req, res) => {
  console.log("GLO")
  console.log("sess: " + req.session)
  // Checks the package table for the user's packages
  const packages = await Package.query()
    .where("id", req.params.id)
    .first()
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    })

  // Returns the list of packages
  res.send(packages);
});
  

// Get a package with the given name
router.get("/users/:userId/getpackagebyname", async (req, res) => {
  // req.query.name has the package name
  // req.params.userId has the user Id
  
  // Package that corresponds to the requested name
  const packs = await Package.query()
    .where("user_id",req.params.userId)
    .where("name",req.query.name)
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    })

  // Respond with the search result
  res.send(packs);
});
  

// Inserting a package
router.post("/users/:userId/packages/", async (req, res) => {
  const indiv = await IndividualUser.query().where("id", req.params.userId).first();
  console.log(indiv);
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
    
    // Checks the Package table for any package with the specified name
    const checkPacks = await Package.query()
      .where("name", req.body.name)
      .count();

    // Retrieves the number of name matches from the query.
    const sameNamePacks = Object.keys(checkPacks[0])[0];
    const count = checkPacks[0][sameNamePacks];
    
    // If the returned value is greater than 0, it means the Package name already exists
    if(count > 0){
      throw DBError;
    }

    //creates a package
    const package = await Package.query().insert({
      id: uuidv4(),
      user_id: indiv.id,
      name: req.body.name,
      description: req.body.description
    });
    console.log(package);

    //uploads the documents being uploaded at the time of package creation
    const document = await Document.query().insert({
      id: uuidv4(),
      user_id: indiv.id,
      package_id: package.id,
      name: req.body.requiredDocuments[0].name,
    });
    console.log(document);

    return res.send(package);
    }catch(error){
      console.log(error);
      return res.status(500).json({
        message:'Internal Error when inserting into database'
      })
    }
}); 
  

// Inserting a package
router.post("/users/:userId/getpackagefromorganization/", async (req, res) => {
  const orgId = req.body.organizationId;
  const packageName = req.body.name;
  const userId = req.params.userId;

  try{
    console.log(orgId + " " + packageName + " " + userId)
    const org = await Organization.query()
      .where("id", orgId)
      .first()

    // const user = await User.query()
    //   .where("id", userId)
    //   .first();
      console.log("USER_ID: " + userId)

    const indiv = await IndividualUser.query()
      .where("id", userId)
      .first();

    const package = await Package.query()
      .insert({
        id: uuidv4(),
        user_id: indiv.id,
        name: packageName,
        description: "(Imported from \"" + org.name + "\")"
      });

    const arp = await ARP.query()
      .where("organization_id", orgId)
      .where("name", packageName)
      .first();

    const ars = await AR.query()
      .where("arp_id", arp.id)

    for (let i = 0; i < ars.length; i++) {
      console.log("   " + i + ": " + package.id)
      const doc = await Document.query().insert({
        id: uuidv4(),
        name: ars[i].name,
        description: ars[i].description,
        url: "",
        package_id: package.id
      });
    }
    return res.send({});
  }catch(error){
    console.dir(error);
    return res.send(500, json({
      message: "Internal Error"
    }));
  }
});
    

// Patches a package (Refining Needed)
router.patch("/users/:userId/packages/:packageId", async (req, res) => {
  console.log("X")
  console.log(JSON.stringify(req.body))
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
    
    // Checks the Package table for any package with the specified name
    const checkPacks = await Package.query()
      .where("name", req.body.name)
      .count();

    // Retrieves the number of name matches from the query.
    const sameNamePacks = Object.keys(checkPacks[0])[0];
    const count = checkPacks[0][sameNamePacks];
    
    // If the returned value is greater than 0, it means the Package name already exists
    if(count > 0){
      throw DBError;
    }
    
    const doc = await Package.query()
      .patch(req.body)
      .findById(req.params.packageId);
      
  return res.send({})
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message:'Internal Error'
    });
  }
});

  
// Delete a package
router.delete("/users/:userId/packages/:packageId", async (req, res) => {
    try{
      const pack = await Package.query()
        .where("id", req.params.packageId)
        .first();
      console.log(pack);

      // Deletes the package (documents get deleted on cascade)
      const removePack = await Package.query()
        .delete()
        .where("id", req.params.packageId);
        
      console.log(removePack);

      // Return the deleted package
      return res.send(pack);
    }catch(error){
      console.log(error);
      return res.status(500).json({
        message:'Internal Error'
      })
    }
});

 
  //updates the specific package
  /*
  router.patch("/users/:userId/packages/:id", async (req, res) => {
    //checks the package table for the user's packages
    const size = Object.keys(req.body.requiredDocuments).length;
    try{
      const indiv = await IndividualUser.query().where("id", req.params.userId).first();
      const pack = await Package.query().where("id", req.params.id).first();
      console.log(pack);
      //updates the name & description
      const updatePack = await Package.query().update(
        {name: req.body.name, description: req.body.description}
      ).where("id", pack.id);
      //deletes all documents that are in the package, and reuploads them
      const clearDoc = await Document.query().delete().where("package_id", pack.id);
      console.log(clearDoc);
      //inserts each document
      for (i = 0; i < size; i++){
        const insertDoc = await Document.query().insert({
          id: uuidv4(),
          user_id: indiv.id,
          package_id: pack.id,
          name: req.body.name,
          description: req.body.description
        });
        console.log(insertDoc);
      }
      return res.send(pack);
    }catch(error){
      console.log(error);
      return res.status(500).json({
        message:'Internal Error when inserting into database'
      })
    }
  });*/
  

  
module.exports = router;