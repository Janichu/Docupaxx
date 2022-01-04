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
const Address = require("../../models/Address");
const ForeignReferencingQuestion = require("../../models/ForeignReferencingQuestion");
const Organization = require("../../models/Organization");
const Question = require("../../models/Question");
const Quiz = require("../../models/Quiz");
const SelfReferencingQuestion = require("../../models/SelfReferencingQuestion");
//
const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require('multer');
const { route } = require("../../web-router");

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



const idReplaceAll = (text) => {
 return text.split("_").join(" ")
}
 
// Middleware that is specific to this router
router.use(function timeLog(req, res, next) {
 console.log("Time: ", Date.now());
 next();
});
 
router.get("/quiz/:quizId", async (req, res) => {
  console.log("using : /quiz/:quizId ");
  try{
    const quiz = await Quiz.query()
      .where("id", req.params.quizId)
      .first()
    return res.send(quiz);

  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

router.get("/quiz" , async (req, res) => {
  console.log("using : /quiz");
  try{
    const quizzes = await findQuery(Quiz)
      .build(req.query)
    return res.send(quizzes);
  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

router.get("/quiz/:questionId/getanswerurl", async (req, res) => {
  const questionId = req.params.questionId
  const answer = req.query.answer
  const question = await Question.query().where("id", questionId).first()

  // If the current table is organization, send to organization package page
  if (question.currentTable == "organization") {
    const org = await Organization.query().where("name", answer.split("_").join(" ")).first()
    return res.send({ url: `/organizations/${org.id}/requirement-packages-page` })
  }

  const childQuestion = await Question.query().where("parentUrlKey", question.currentUrlKey).first()

  return res.send({ url: `/quiz/${childQuestion.currentUrlKey}?parent=${answer}` })
})

router.get("/quiz/question/getbycurrenturlkey" , async (req, res) => {
  try{
    const question = await Question.query().where("currentUrlKey", req.query.key).first()
    console.log("K: " + JSON.stringify(question))
    return res.send(question);
  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

router.get("/quiz/question/:questionId/getanswers" , async (req, res) => {
  const tableMap = {
    "address": Address,
    "organization": Organization
  }
  const questionId = req.params.questionId
  const question = await Question.query().where("id", questionId).first()
  const parentAnswer = req.query.parentAnswer.split("_").join(" ")
  const parentField = question.parentField
  const currentTable = tableMap[question.currentTable];
  const currentField = question.currentField
  
  const selfs = await SelfReferencingQuestion.query().where("question_id", questionId)

  if (parentField.trim().length == 0 || parentField == "null" || parentField == "-") {
    // If the parents are null
    const currentObjects = await findQuery(currentTable).build()
    const currentResults = currentObjects.map((obj) => obj[currentField])
    return res.send(currentResults)

  } else if (selfs.length > 0) {
    // If the parents are not null but it is self referencing
    const parentTable = tableMap[question.parentTable]
    const parentObjects = await parentTable.query().where(parentField, parentAnswer)
    const currentResults = parentObjects.map((obj) => obj[currentField])
    return res.send(currentResults)

  } else {
    // If the parents sre not null but it is foreign referencing
    const foreigns = await ForeignReferencingQuestion.query().where("question_id", questionId)
    const parentTable = tableMap[question.parentTable]
    const parentObjects = await parentTable.query().where(parentField, parentAnswer)
    const referencingField = foreigns[0].referencingField
    const referencedField = foreigns[0].referencedField
    console.log("REFDF: " + referencedField)
    const parentReferencedFields = parentObjects.map((obj) => obj[referencedField])
    console.log("PRF: " + JSON.stringify(parentReferencedFields))
    let currentQuery = currentTable.query().where(referencingField, parentReferencedFields[0])
    for (let i = 1; i < parentReferencedFields.length; i++) {
      currentQuery = currentQuery.orWhere(referencingField, parentReferencedFields[i])
    }
    const currentObjects = await currentQuery;
    const currentResults = currentObjects.map((obj) => obj[currentField])
    return res.send(currentResults)
  }
});

router.get("/quiz" , async (req, res) => {
  console.log("using : /quiz");
  try{
    const quizzes = await findQuery(Quiz)
      .build(req.query)
    return res.send(quizzes);
  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

router.post("/quiz", async (req, res) => {
  console.log("using : /quiz");
  try{
    const quizInsert = await Quiz.query()
      .insert({
        id: uuidv4(),
        description: req.body.description,
      })

      return res.send({})
  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

router.patch("/quiz/:quizId", async (req, res) => {
  console.log("using: /quiz/:quizId");
  try{
    const quizPatch = await Quiz.query()
      .where("id", req.params.quizId)
      .patch({
        description: req.body.description,
      })
      return res.send({})

  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

router.delete("/quiz/:quizId", async (req, res) => {
  console.log("using: /quiz/:quizId");
  try{
    const deleteQuiz = await Quiz.query()
      .delete()
      .where("id", req.params.quizId)

    return res.send({})

  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

router.delete("/quiz", async (req, res) => {
  console.log("using: /quiz");
  try{
    const deleteAllQuiz = await Quiz.query()
      .delete()

    return res.send({})

  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

// Gets all the possible countries
router.get("/quiz/countries", async (req, res) => {
  console.log("using: /quiz/countries")
  // Respond with the search result
  try {
    const countries = await Address.query().distinct("country");
    return res.send(countries.map((country, index) => ({ id: index, name: country.country })));
  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }
});
  
  
// Gets all the possible cities of a country
router.get("/quiz/countries/:countryId/cities", async (req, res) => {
  console.log("Calling: /quiz/countries/:countryId/cities")
  //countryId = country name in lower case
  const country = idReplaceAll(req.params.countryId)
  console.log(country)
  // Respond with the search result
  try {
    const cities = await Address.query().distinct("city").where("country",country)
    console.log(JSON.stringify(cities))
    return res.send(cities.map((city,index) => ({ id: index, name: city.city })));
  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }    
});
  
  
// Gets all the possible organizations of a city
router.get("/quiz/cities/:cityId/organizations", async (req, res) => {
  const city = idReplaceAll(req.params.cityId)
    
  // Respond with the search result
  try {
    // 1. find all address ids that contain city 
    const addressIds = await Address.query()
      .select("id")
      .where("city", city);
      
    // 2. find all orgs that have addressId FK
    const length = addressIds.length;
    // Get the first org
    let organizations = Organization.query()
      .select("name", "id")
      .where('address_id', addressIds[0].id);
    // Get the rest of orgs
    for(let i = 1; i < length;i++){
      organizations = organizations
        .orWhere('address_id', addressIds[i].id);
    }
    const orgs = await organizations;

    // Get all ARPs for the Organization(s)
    const orgsWithPackages = []
    for (let i = 0; i < orgs.length; i++) {
      console.log(i + ": " + JSON.stringify(orgs[i]))
      const arps = await ARP.query()
        .where('organization_id', orgs[i].id)

      if (arps.length > 0) {
        orgsWithPackages.push(orgs[i])
      }
    }

    return res.send(orgsWithPackages);
  }catch(error){
    console.dir(error); 
    return res.status(500).json({
      message:'Internal Error'
    })
  }  
});

// Get one question
router.get("/quiz/:quizId/questions/:questionsId", async (req,res) =>{
  const question = await Question.query()
    .where("id", req.params.questionId);

  const foreigns = await ForeignReferencingQuestion.query().where("question_id", question.id)

  if (foreigns.length > 0) {
    question.foreignReferencedKey = foreigns[0].foreignReferencedKey
    question.foreignReferencingKey = foreigns[0].foreignReferencingKey
  } else {
    question.foreignReferencedKey = "-"
    question.foreignReferencingKey = "-"
  }

  return res.send(question);
});

// Gets all the questions in the Question table
router.get("/quiz/:quizId/questions", async (req,res) =>{
  const questions = await findQuery(Question)
    .build(req.query)
    .catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    });
  return res.send(questions);
});

// Creates a question 
router.post("/quiz/:quizId/questions", async(req,res) =>{
  try{
    // Get the quiz 
    const theQuiz = await Quiz.query()
      .where("id",req.params.quizId)  
      .first();

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
    if(req.body.type == "foreignReferencing"){
      const foreignReference = await ForeignReferencingQuestion.query()
      .insert({
        id: uuidv4(),
        question_id : newQuestion.id,
        referencedField : req.body.referencedField,
        referencingField : req.body.referencingField
      })
    }else if(req.body.type == "selfReferencing"){
      const currentReference = await SelfReferencingQuestion.query()
      .insert({
        id: uuidv4(),
        question_id : newQuestion.id,
      })
    }

    return res.send({});
  }catch(error){
    console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
  }
});

// Update a question
router.patch("/quiz/:quizId/questions/:questionId", async(req,res) => {
  const patchQuestion = await Question.query()
    .where("id", req.params.questionId)
    .patch({
      answerType: req.body.answerType,
      parentUrlKey: req.body.parentUrlKey,
      parentTable : req.body.parentTable,
      parentField : req.body.parentField,
      currentTable : req.body.currentTable,
      currentField : req.body.currentField,
      currentUrlKey : req.body.currentUrlKey,
      question : req.body.question,
    }).catch((error)=>{
      console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    });
    return res.send({});
});

// Delete a single question
router.delete("/quiz/:quizId/questions/:questionId", async(req,res) =>{
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

// Delete all questions
router.delete("/quiz/:quizId/questions", async(req,res) =>{
  try{
    
    const deleteAllQuestion = await Question.query()
      .delete()
      .where("quiz_id", req.params.quizId);

    const deleteForeignReference = await ForeignReferencingQuestion.query()
      .delete();

    const deleteSelfReference = await SelfReferencingQuestion.query()
      .delete();

    return res.send({});
  }catch(error){
    console.dir(error);
      return res.send(500,json({
        message: "Internal Error"
      }))
    }
});
  
module.exports = router;