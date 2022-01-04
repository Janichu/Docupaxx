/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
 var express = require("express");
 var router = express.Router();
 const bodyParser = require("body-parser");
 const cors = require("cors");
 const { v4: uuidv4 } = require("uuid");
// Imports the database Models
const Document = require("../../models/Document");
const Package = require("../../models/Package");
const SentDocument = require("../../models/SentDocument");
const SentPackage = require("../../models/SentPackage");
const User = require("../../models/User");
//
 const { findQuery } = require("objection-find");
 const Joi = require("joi");
 const multer = require('multer');
 const { route } = require("../../web-router");
const { getKeyFromUrl, uploadFile, downloadFile } = require("../../s3");
const fs = require("fs");

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
 
 // middleware that is specific to this router
 router.use(function timeLog(req, res, next) {
   console.log("Time: ", Date.now());
   next();
 });
 
 // Get a SentPackage of an Individual User
router.get("/users/:userId/sentpackage/:sentPackageId", async (req,res)=>{
  const sentPackage = await SentPackage.query()
    .where("user_id", req.params.userId)
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

 // Get all SentPackages of an Individual User
router.get("/users/:userId/sentPackages", async(req,res)=>{
  const sentPackages = await SentPackage.query()
    .where("user_id", req.params.userId)
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    });
  return res.send(sentPackages);
})
 // User sends a package to an organization
 router.post("/users/:userId/sentPackages", async (req,res)=>{
   const userId = req.params.userId;
   const packageId = req.body.packageId;
   const organizationId = req.body.organizationId;
   
   console.log(JSON.stringify({ userId, packageId, organizationId}) )
   
   // Helper function that clones file from given url to make
   //  a deep copy and return new url
   const clonedUrl = async(url) => {
      // Get file name (key) from url 
      console.log("url: " + url)
      console.log("  []")
      const key = getKeyFromUrl(url);
    
      // Download file
      const downloadedFile = await downloadFile(key);

      // Cast the downloadedFile.Body so its not type "object"
      let buffer = Buffer.from(downloadedFile.Body);

      console.log(typeof buffer);
      // Store (temp) downloaded file and make deep copy
      const filename = new Date().toISOString().replace(/:/g, "-") + key.substring(24);
      const path = "uploads/" + filename;
      fs.writeFileSync(path,buffer);

      // Prepare for upload
      downloadedFile.path = path;
      downloadedFile.filename = filename;

      // Upload the cloned file
      const uploadedFile = await uploadFile(downloadedFile);
      
      // Delete the (temp) stored/downloaded file 
      fs.unlinkSync(path);

      console.log("UF: " + uploadedFile.Location)
      
      // Return url of cloned file
      return uploadedFile.Location
   };

   // Get package info
   const package = await Package.query()
      .findById(packageId)
      .catch((error)=>{
        console.dir(error);
        return res.send(500,json({
          message: "Internal Error"
         }))
      })

    // Make a SentPackage data entry
    const sentPackage = await SentPackage.query()
      .insert({
        id: uuidv4(),
        name: package.name,
        description: package.description,
        user_id: userId,
        organization_id: organizationId
      }).catch((error)=>{
        console.dir(error)
        return res.send(500,json({
          message: "Internal Error"
        }))
      })

    // Find all Documents in the package
    const documents = await Document.query()
      .where("package_id", package.id)
      .catch((error)=>{
        console.dir(error)
        return res.send(500,json({
          message: "Internal Error"
        }))
      })
    // Get number of documents
    // console.dir(await clonedUrl(documents[0].url));
    const docLength = documents.length;
    console.log("dl: " + docLength)

    // Make SendDocuments entries with documents
    // If package has any documents, create SendDocument entries
    if(Array.isArray(documents) && docLength){
      for(i = 0; i < docLength; i++){
        console.log("i: " + JSON.stringify(documents[i]))
        const sentDocument = await SentDocument.query()
          .insert({
            id: uuidv4(),
            name: documents[i].name,
            description: documents[i].description,
            sentPackage_id: sentPackage.id,
            url: await clonedUrl(documents[i].url)
          }).catch((error)=>{
            console.dir(error)
            return res.send(500,json({
              message: "Internal Error"
            }))
          })
      }
    }
    return res.send({});
 })
  module.exports = router;