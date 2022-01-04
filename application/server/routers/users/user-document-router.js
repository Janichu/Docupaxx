/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
require('dotenv').config()
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
// Imports the database Models
const Document = require("../../models/Document");
const Package = require("../../models/Package");
// Imports functional dependencies
const { findQuery } = require("objection-find");
const Joi = require("joi");
const { route } = require("../../web-router");
const {uploadFile} = require("../../s3");
const path = require('path');
//using multer to upload file
const multer = require('multer');
const multers3 = require('multer-s3');
const aws = require('aws-sdk');
const { DataError, DBError } = require("objection");

 // config of aws s3 bucket will be stored in .env file
//  aws.config.update({
//   secretAccessKey: process.env.AWS_SECRET_KEY,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   region: process.env.AWS_BUCKET_REGION
// });
//  const s3 = new aws.S3();

 //bucket S3 in aws
//  const storageS3 =  multers3({
//   s3: s3,
//   bucket: process.env.AWS_BUCKET_NAME,
//   // filename: function(req,file, cb){
//   //   cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   // },
//   key: function (req, file, cb) {
//       console.log(file);
//       cb(null, file.originalname);
//   }
  
// })
const storage = multer.diskStorage({
 destination: function (req, file, cb){
   cb(null, './uploads');
 },
 filename: function(req,file, cb){
   const extParts = file.originalname.split(".")
   const ext = extParts[extParts.length - 1]
  cb(null, new Date().toISOString().replace(/:/g, "-") + "XXX." + ext);
  },
});

//upload the image to S3 storage
const upload = multer({
  storage: storage,
  // fileFilter will filter all file whose extension is not .pdf
  // if not pdf extension, it will prevent the file to be uploaded to s3 and database
  fileFilter: (req, file, cb) =>{
    var ext = path.extname(file.originalname);
    console.log("ext: " + ext);
    if(ext !== '.pdf' && ext !== '.PDF'){
      return cb(new Error('Only PDFs can be uploaded as documents'))

    }
    cb(null,true);
  },
  limits: {
    fileSize: 1024 * 1024 * 10,
  }

  //  fileFilter: (req, file, cb) => {
  //    const fileType = /pdf/;
  //    const mimetype = fileType.test(file.mimetype);
  //    const extension = fileType.test(path.extension(file.originalname));
  //    if( mimetype && extension){
  //      return cb(null, true);
  //     }
  //     cb("Error: Not a pdf file!");
    // if (file.mimetype !== 'pdf'){
    //   cb(null, false);
    //   console.log('Not a pdf file!');
    // }else{
    //   cb(null, true);
    //   console.log('Its a pdf file');
    // }
   
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
 
 

/************************************
* API ROUTES
***********************************/

// Search for a users documents
router.get("/users/:userId/documents/search", async (req, res) => {
  //finds all documents that fulfill the query
  const docs = await findQuery(Document)
    .build(req.query)
    .where("user_id", req.params.userId)
    .catch((error)=>{
      console.dir(error)
      return res.send(500, json({
        message: "Internal error"
      }))
    });

  // Respond with the search result
  return res.send(docs);
});
  
// Get one specific document (Refining Needed)
router.get("/users/:userId/documents/:packageId/:documentId", async (req, res) => {
  const doc = await Document.query()
    .where("id", req.params.documentId)
    .first()
    .catch((error)=>{
      console.dir(error)
      return res.send(500, json({
        message: "Internal error"
      }))
    });

  // Respond with the search result
  return res.send(doc);
});
  
// Get all documents for a specific package
router.get("/users/:userId/documents/:packageId", async (req, res) => {

  const docsInPack = await Document.query()
    .where("package_id", req.params.packageId)
    .catch((error)=>{
      console.dir(error)
      return res.send(500, json({
        message: "Internal error"
      }))
    });

  return res.send(docsInPack);
})
  

// Create a document (Refining Needed)
router.post("/users/:userId/documents/:packageId", upload.fields([{ name: "documentFile", maxCount: 1 }]), async (req, res) => {
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
    //uploads the documents
    const uploadedFile = await uploadFile(req.files.documentFile[0])
    console.log("Body: " + JSON.stringify(req.body))
    console.log(uploadedFile.Location)

    const package = await Package.query()
      .where("id",req.params.packageId)
      .first();

    // Checks the Document table for any document with the specified name inside the package
    const checkDocs = await Document.query()
      .where("package_id", package.id)
      .where("name", req.body.name)
      .count();
    console.log(checkDocs);

    // Retrieves the number of name matches from the query.
    const sameNameDocs = Object.keys(checkDocs[0])[0];
    const count = checkDocs[0][sameNameDocs];

    // If the returned value is greater than 0, it means the Document name already exists
    if(count > 0){
      throw DBError;
    }

    const doc = await Document.query().insert({
      id: uuidv4(),
      name: req.body.name,
      description: req.body.description,
      url: uploadedFile.Location,
      package_id: package.id
    }).catch((error)=>{
        console.dir(error)
        return res.send(500, json({
          message: "Internal error"
        }))
    });
    console.log(doc);

    return res.send({});
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    })
  }
});

// Upload a document file (S3)
router.post("/users/:userId/documents/:packageId/upload", upload.array('inputfile', 1), async (req, res) => {
  const file = req.files[0];
  const uploadedFile = await uploadFile(file)
    .catch((error)=>{
      console.dir(error);
      return res.send(500, "Internal Error")
    })
  console.log(uploadedFile.Location);
  return res.send('Uploaded to S3');
});
  
// Modify a document (Refining Needed)
router.patch("/users/:userId/documents/:packageId/:documentId", upload.fields([{ name: "documentFile", maxCount: 1 }]), async (req, res) => {
  
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
    const uploadedFile = await uploadFile(req.files.documentFile[0])
    console.log("Body: " + JSON.stringify(req.body))
    console.log(uploadedFile.Location)
    const package = await Package.query()
      .where("id",req.params.packageId)
      .first();
    
    // Checks the Document table for any document with the specified name inside the package
    const checkDocs = await Document.query()
      .where("package_id", package.id)
      .where("name", req.body.name)
      .count();
    // Retrieves the number of name matches from the query.
    const sameNameDocs = Object.keys(checkDocs[0])[0];
    const count = checkDocs[0][sameNameDocs];

    // If the returned value is greater than 0, it means the Document name already exists inside the package
    if(count > 0){
      throw DBError;
    }

    const doc = await Document.query()
      .patch({
        name: req.body.name,
        description: req.body.description,
        url: uploadedFile.Location
      })
      .findById(req.params.documentId)

    return res.send({})
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    });
  }
  
});


// Delete a document
router.delete("/users/:userId/documents/:packageId/:documentId", async (req, res) => {
  try{
    //deletes the document
    const doc = await Document.query().delete().where("id", req.params.documentId).first();
    console.log("number of docs deleted" + doc);
    return res.send(JSON.stringify(doc));
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    })
  }
});


  

   //updates the specific document
  // router.patch("/users/:userId/documents/:id",upload.fields([{ name: "file", maxCount: 1 }]),async (req, res) => {
  //   try{
  //     //update the document with the edited information
  //     const updateDoc = await Document.query().update(
  //       {name: req.body.name, description: req.body.description, url: req.files.file[0].path}
  //     ).where("id", req.params.id);
  //     return res.send(updateDoc);
  //   }catch(error){
  //     console.log(error);
  //     return res.status(500).json({
  //       message:'Internal Error when inserting into database'
  //     })
  //   }
  // });

  module.exports = router;