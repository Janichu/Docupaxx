/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// Imports the database Models
//
const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require('multer');
const {downloadFile} = require("../../s3");
 
const { route } = require("../../web-router");
//storage of the files
const storage = multer.diskStorage({
 //changes the location of the uploads
 destination: function (req, file, cb) {
   cb(null, __dirname + "/../../uploads");
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
 


// Get the names of all organizations
router.get("/files", async(req,res)=>{
  try{
    const key = req.query.key
    if (key.length == 0) {
      return res.send({ error: "Cannot have empty key" })
    }
    console.log("Key: " + key)
    const downloadedFile = await downloadFile(key)
    console.log("Downloaded: " + JSON.stringify(Object.keys(downloadedFile)))
    return res.send({ value: downloadedFile })
  }catch(error){
    console.dir(error);
    return res.send(500,json({
      message: "Internal Error"
    }))
  }
})



module.exports = router;