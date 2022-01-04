/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
 var express = require("express");
 var router = express.Router();
 const bodyParser = require("body-parser");
 const cors = require("cors");
 const { v4: uuidv4 } = require("uuid");
// Imports the database Models
const ForeignReferencingQuestion = require("../../models/ForeignReferencingQuestion");
const Question = require("../../models/Question");
const Quiz = require("../../models/Quiz");
const SelfReferencingQuestion = require("../../models/SelfReferencingQuestion");
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


// Get all questions in the system
router.get("/admins/:adminId/questions", async (req, res) => {
  try{
    // Get the quiz 
    const theQuiz = await Quiz.query()
      .where("id","0c91ac64-7469-4b50-b25a-d91cdc4c216e")  
      .first();
    console.log("check one")

    // Gets all the questions in the Question table
  const questions = await findQuery(Question)
    .build({})
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    });
  return res.send(questions);


  }catch(error){
    console.dir(error);
    return res.send(500,json({
      message: "Internal Error"
    }))
  }
});

// Post all questions in the system
router.post("/admins/:adminId/questions", async (req, res) => {
  try{
    // Get the quiz 
    const theQuiz = await Quiz.query()
      .where("id","0c91ac64-7469-4b50-b25a-d91cdc4c216e")  
      .first();
    console.log("check one")
    const newQuestion = await Question.query()
      .insert({
        id : uuidv4(),
        quiz_id: theQuiz.id,
        answerType: req.body.answerType,
        parentUrlKey: req.body.parentUrlKey,
        parentTable : req.body.parentTable,
        parentField : req.body.parentField,
        currentTable : req.body.currentTable,
        currentField : req.body.currentField,
        currentUrlKey : req.body.currentUrlKey,
        question : req.body.question,
      })
     
      if (req.body.foreignReferencedKey && req.body.foreignReferencedKey.trim() != "-") {
        const newForeign = await ForeignReferencingQuestion.query()
          .insert({
            id: uuidv4(),
            question_id: newQuestion.id,
            referencedField: req.body.foreignReferencedKey,
            referencingField: req.body.foreignReferencingKey
          })
      } else {
        const newSelf = await SelfReferencingQuestion.query()
          .insert({
            id: uuidv4(),
            question_id: newQuestion.id
          })
      }
    return res.send({})
     
  }catch(error){
    console.dir(error);
    return res.send(500,json({
      message: "Internal Error"
    }))
  }
});

// Update a question
router.patch("/admins/:adminId/questions/:questionId", async(req,res) => {
  const patchQuestion = await Question.query()
    .patch({
      answerType: req.body.answerType,
      parentUrlKey: req.body.parentUrlKey,
      parentTable : req.body.parentTable,
      parentField : req.body.parentField,
      currentTable : req.body.currentTable,
      currentField : req.body.currentField,
      currentUrlKey : req.body.currentUrlKey,
      question : req.body.question,
    })
    .findById(req.params.questionId)
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    });

    const question = await Question.query().where("id", req.params.questionId).first()

    console.log(req.params.questionId + "___" + patchQuestion.id)
    const foreigns = await ForeignReferencingQuestion.query().where("question_id", question.id)

    if (foreigns.length > 0) {
      const foreignPatch = await ForeignReferencingQuestion.query()
        .patch({
          referencedField: req.body.foreignReferencedKey,
          referencingField: req.body.foreignReferencingKey
        })
        .findById(foreigns[0].id)
    }

    return res.send({});
});

// Get one question
router.get("/admins/:adminId/questions/:questionId", async (req,res) =>{
  const question = await Question.query()
    .where("id", req.params.questionId).first();

  const foreigns = await ForeignReferencingQuestion.query().where("question_id", question.id)

  if (foreigns.length > 0) {
    question.foreignReferencedKey = foreigns[0].referencedField
    question.foreignReferencingKey = foreigns[0].referencingField
  } else {
    question.foreignReferencedKey = "-"
    question.foreignReferencingKey = "-"
  }

  return res.send(question);
});


// Delete a single question
router.delete("/admins/:adminId/questions/:questionId", async(req,res) =>{
  try{
    
    const deleteQuestion = await Question.query()
      .delete()
      .where("id", req.params.questionId);

    const deleteForeignReference = await ForeignReferencingQuestion.query()
      .delete()
      .where("id", req.params.questionId);
    
    const deleteSelfReference = await SelfReferencingQuestion.query()
      .delete()
      .where("id", req.params.questionId);
  
    return res.send({});
  }catch(error){
    console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
  }
});







module.exports = router;