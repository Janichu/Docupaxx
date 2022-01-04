/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const Address = require("./models/Address");
const Organization = require("./models/Organization");

const Package = require("./models/Package");
const Document = require("./models/Document");
const Question = require("./models/Question");
const QuizARP = require("./models/QuizArp");
const OrganizationMember = require("./models/OrganizationMember");

const IndividualUserQuiz = require("./models/IndividualUserQuiz");
const IndividualUserARP = require("./models/IndividualUserARP");
const IndividualUser = require("./models/IndividualUser");
const AR = require("./models/Ar");
const ARP = require("./models/ARP");
const Quiz = require("./models/Question");


const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require('multer');
const bcrypt = require('bcrypt');


const { route } = require("./web-router");
//using multer to upload form data, for images
const { uploadFile } = require("./s3");

const { ConstraintViolationError } = require("objection");
//storage of the files
const storage = multer.diskStorage({
  //changes the location of the uploads
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
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
  console.log(req.url)
  next();
});

/**
* isCapitalLetter
*/
const isCapitalLetter = (characterText) => {
  const aUpperCaseCode = "A".charCodeAt(0)
  const zUpperCaseCode = "Z".charCodeAt(0)
  const characterCode = characterText.charCodeAt(0)
  if (characterCode >= aUpperCaseCode && characterCode <= zUpperCaseCode) {
      return true
  }
  return false
}

/**
* splitCamelCaseText
*/
const splitFromCamelCaseText = (text) => {
  const wordList = []
  let charList = [text.substring(0, 1)]
  for (let i = 1; i < text.length; i++) {
      const charText = text.substring(i, i+1)
      if (isCapitalLetter(charText)) {
          wordList.push(charList.join(""))
          charList = []
      }
      charList.push(charText)
  }
  if (charList.length > 0) {
      wordList.push(charList.join(""))
  }
  return wordList
}

const capitalizeFirstLetter = (text) => {
  const firstLetter = text.substring(0, 1)
  const rest = text.substring(1, text.length)
  return firstLetter.toUpperCase() + rest
}



/**
* convertCamelCaseToHyphenatedText
*/
const convertCamelCaseToHyphenText = (camelCaseText) => {
  return splitFromCamelCaseText(camelCaseText).join("-").toLowerCase()
}



/**
* convertCamelCaseToTitleText
*/
const convertCamelCaseToTitleText = (camelCaseText) => {
  return capitalizeFirstLetter(splitFromCamelCaseText(camelCaseText).join(" "))
}







/**
* isVisibleString
* 
* Returns true if a string is nonnull, nonempty, and is not purely whitespacde
*/
const isVisibleString = (text) => {
  return text && text.length > 0 && text.trim().length > 0
}



/**
* joinCamelCaseText
*/
const joinToCamelCase = (textList, uppercase) => {
  const wordList = []
  for (let i = 0; i < textList.length; i++) {
      wordList.push(capitalizeFirstLetter(textList[i].toLowerCase()))
  }
  if (!uppercase) {
      wordList[0] = wordList[0].toLowerCase()
  }
  return wordList.join("")
}



router.get("/sessions", async (req, res) => {
  console.log("req.session.id: " + JSON.stringify(req.sessionID))
  if (!req.session.locals) {
    console.log("no locals")
    req.session.locals = {
      "type": "signedOut",
      "user": "",
      "userId": "",
      "id": 1,
      "dashboardToken": "",
      "messageHeader": "",
      "message": "",
      "status": "",
      "count": ""
    }
    await req.session.save()
  }
  console.log("req.session.locals: " + JSON.stringify(req.session.locals))
  res.send([req.session.locals])
})

router.patch("/sessions/:id", async (req, res) => {
  console.log("req.session.id: " + JSON.stringify(req.sessionID))
  console.log("req.body: " + JSON.stringify(req.body))
  req.session.locals = req.body
  await req.session.save()
  res.send([req.session.locals])
})

// This method is called when submitting the form in Organization Page
//req.file is the file being sent as part of the request
// now supporting multiple files upload
router.post("/organizations", upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),async (req, res) => {
    
    // console.log(req.files); // testing purpose to see what's in the files
    //Defining the schema
    const organizationSchema = Joi.object().keys({
      organizationName: Joi.string().min(3).max(255).required(),
      organizationAddress: Joi.string().required(),
      organizationType: Joi.string().required(),
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email({ tlds: { allow: false } }),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    });
    //Uses built-in Joi validate function to check if the body sent in the request
    //fulfills the conditions set in the schema
    const result = organizationSchema.validate(req.body);
    //If the validation fails, returns a request error because the request could not be fulfilled.
    if (result.error) {
      return res.status(400).json({
        message: "Request error",
      });
    }

    // TEST - Inserts hardcoded url for forms that do not upload files
    let thumbnail = null;
    if(req.files){
      thumbnail = req.files.thumbnail[0].path;
    }else{
      thumbnail = "Thumbnail_url";
    }
    let image = null;
    if(req.files){
      image = req.files.image[0].path;
    }else{
      image = "Image_url";
    }

    
    // Error catching
    try {
      // Create Organization and insert into the database
      const organization = await Organization.query().insert({
        id: uuidv4(),
        name: req.body.organizationName,
        address: req.body.organizationAddress,
        type: req.body.organizationType,
        //thumbnail: req.files.thumbnail[0].path,
        thumbnail: thumbnail,
        image: image,
        //image: req.files.image[0].path,
      });

      //basically, what it does is just turn the password being registered to hashes
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      // Create Organization Lead and insert into the database
      const user = await User.query().insert({
        id: uuidv4(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      console.log(typeof user.id);

      // Create OrganizationUser with Organization and User id's and insert to the database
      const organizationUser = await OrganizationUser.query().insert({
        id: uuidv4(),
        organization_id: organization.id,
        user_id: user.id,
        is_admin: true,
      });

      // Respond with the organizationuser object
      return res.send(organizationUser);
    } catch (error) {
      console.log(error);
      //A response is still required because there is a request
      return res.status(500).json({
        message: "Internal error",
      });
    }
  }
);

router.post("/organizationsTest", upload.fields([{name: 'thumbnail', maxCount: 1}, {name: 'image', maxCount: 1}]), async (req, res) => {
  //Defining the schema
  console.log(typeof uuidv4());
  const organizationSchema = Joi.object().keys({
    organizationName: Joi.string()
      .min(3)
      .max(255)
      .required(),
    organizationAddressStreet: Joi.string().required(),
    organizationAddressCity: Joi.string().required(),
    organizationAddressCountry: Joi.string().required(),
    organizationAddressZip: Joi.string().required(),
    organizationType: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } }),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
  });
  //Uses built-in Joi validate function to check if the body sent in the request 
  //fulfills the conditions set in the schema
  const result = organizationSchema.validate(req.body);  
  //If the validation fails, returns a request error because the request could not be fulfilled.
  if (result.error) { 
    return res.status(400).json({ 
      message: 'Request error' 
    }); 
  }

  // Error catching
  try{
    
    // Create Organization and insert into the database
    const address = await Address.query().insert({
      id: uuidv4(),
      street: req.body.organizationAddressStreet,
      city: req.body.organizationAddressCity,
      country: req.body.organizationAddressCountry,
      zip: req.body.organizationAddressZip
    });
    console.log(address);

    // 
    const organizationTest = await OrganizationTest.query().insert({
      id: uuidv4(),
      name: req.body.organizationName,
      address_id: address.id,
      type: req.body.organizationType,
      // default thumbnail and images for every organization
      thumbnail: req.files.thumbnail[0].path,
      image: req.files.image[0].path
    });
    console.log(organizationTest);

    // Create Organization Lead and insert into the database
    const user = await User.query().insert({
      id: uuidv4(),
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    console.log(user);

    console.log(typeof uuidv4.id);
    // Create OrganizationUser with Organization and User id's and insert to the database
    const organizationUserTest = await OrganizationUserTest.query().insert({
      id: uuidv4(),
      organization_id: organizationTest.id,
      user_id: user.id,
      is_admin: true,
    });
    console.log(organizationUserTest);
    // Respond with the organizationuser object
    return res.send(organizationUserTest);

  }catch(error){
    //A response is still required because there is a request
    console.log(error);
    return res.status(500).json({ 
      message: 'Internal error'   
    })
}
});


// Getting all the ARPs for a given organization
router.get("/commented-organizations/:organizationId/arps/", async (req, res) => {
  // Get the parameter values
  const organizationID = req.params.organizationId;
  
  try{
    // Get all arp_ids for a the organization_id
    const arpIds = await OrganizationARP.query().select('arp_id').where("organization_id", organizationID);  
    
    // Get arp id, name, description for a given arp
    let query = ARP.query().select('id', 'name','description').where('id', arpIds[0].arp_id); // The first arp 
    for(let i = 1; i < arpIds.length;i++){
      query = query.orWhere('id', arpIds[i].arp_id);
    }
    
    console.dir(query);

    return res.send(await query);

  }catch(error){
    console.dir(error);
    
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    });
  }
});

// Find all documents (AR)  of an ARP for a given organization
router.get("/commented-organizations/:organizationId/arps/:arpId/", async (req, res) => {
  // Save the paremeter values
  const organizationID = req.params.organizationId;
  const arpID = req.params.arpId;

  try{
    // Get id and description
    const query = await AR.query().select('id', 'description AS name').where('arp_id', arpID);
    
    console.dir(query);

    return res.send(query);
    
  }catch(error){
    console.dir(error);

    return res.status(500).json({
      message:'Internal Error. Invalid query'
    });
  }
});

// Create an ARP
router.post("/organizations/:organizationId/arps/", async (req, res) => {
  // Save the paremeter values
  const organizationID = req.params.organizationId; 
  
  // Get ARP info
  const arpName = req.body.name;
  const arpDesc = req.body.description;
  // Get list of AR info
  const arList = req.body.requiredDocuments;
  const size = Object.keys(req.body.requiredDocuments).length;

  try{
    // 1 - Insert the ARP 
    const insertArp = await ARPtest.query().insert({
      id: uuidv4(),
      name: arpName,
      organization_id: organizationID,
      description: arpDesc,
    });

    console.dir(insertArp);
    
    // Delete existing ARs
    const deleteARs = await ARtest.query().delete().where("arp_test_id", insertArp.id);
    
    // 2 - Insert the ARs  
    for (i = 0; i < size; i++){
      const insertAR = await ARtest.query().insert({  
        id: uuidv4(),          
        description: arList[i].name,
        arp_test_id: insertArp.id,
      });
    }
    // for (i = 0; i < size; i++){
    //   const insertAR = await ARtest.query().patch({            
    //     description: arList[i].name,
    //   }).where("arp_test_id", insertArp.id);
    // }

    return res.send(insertArp); 
    
  }catch(error){
    console.dir(error);
    
    return res.status(500).json({
      message:'Internal Error. Invalid query'
    });
  }


});
// Remove an organization's ARP and its required documents (ARs)
router.delete("/organizations/:organizationId/arps/:arpId/", async (req, res) => {
  // Save the paremeter values
  const organizationID = req.params.organizationId; // Not needed
  const arpID = req.params.arpId;
  
  try{
    // Get delete ARP from  and description
    const query = await ARPtest.query().deleteById(arpID); 


    return res.send(JSON.stringify(query)); // query is the number or rows affected (int)
    
  }catch(error){
    console.dir(error);
    
    return res.status(500).json({
      message:'Internal Error. Invalid query'
    });
  }
});

// Update an organization's ARP 
router.patch("/commented-organizations/:organizationId/arps/:arpId/", async (req, res) => {
  // Save the paremeter values
  const organizationID = req.params.organizationId; 
  const arpID = req.params.arpId;
  // Get ARP info
  const arpName = req.body.name;
  const arpDesc = req.body.description;
  // Get list of AR info
  const arList = req.body.requiredDocuments;
  const size = Object.keys(req.body.requiredDocuments).length;

  try{
    // 1 - Update the ARP 
    const updateArp = await ARPtest.query().update({
      name: arpName, 
      description: arpDesc
    }).where("id", arpID);

    
    // 2 - Update the ARs  
    for (i = 0; i < size; i++){
      const updateAR = await ARtest.query().update({            
        description: arList[i].name,
      }).where("arp_test_id", arpID);
    }

    return res.send(200); 
    
  }catch(error){
    console.dir(error);
    
    return res.status(500).json({
      message:'Internal Error. Invalid query'
    });
  }
});

router.get('/login', async (req, res)=>{
  console.log('starting!');
  const iUser = (await findQuery(IndividualUser).build({})).map((user) => ({...user, type: "iUser"}));
  const orgMembers = (await findQuery(OrganizationMember).build({})).map((item) => ({...item, type: "orgMember"}));
  const orgLeads = (await findQuery(User).build({})).map((item) => ({...item, type: "orgLead"}));
  const users = [...iUser, ...orgMembers, ...orgLeads];  
  const emailFilteredUsers = users.filter((emailFilteredUsers) => emailFilteredUsers.email == req.query.email);
  console.log('email matched');
  console.log(emailFilteredUsers);
  console.log(req.query.email);
  if(emailFilteredUsers == null){
    return res.status(400).send('No user with such email!');
  }
  try{
    console.log('trying');
    console.log(req.query.password);
    console.log(emailFilteredUsers[0].password);
    if( bcrypt.compareSync(req.query.password, emailFilteredUsers[0].password)){
      console.log('Compared works');
      res.send(emailFilteredUsers);
    }
  }catch{
    res.status(404).send('Passwords cannot be compared!');
  }
})

router.post("/signup",  async (req, res) => {
  console.log(req.body);
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if(req.body.type == "iUser"){
      const individualUser = await IndividualUser.query().insert({
        id: uuidv4(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      console.log(individualUser);
      return res.send(individualUser);
    }
    else if(req.body.type == "orgMember"){
      const organization = await Organization.query().where("name", req.body.organization).first();
      const organizationMember = await OrganizationMember.query().insert({
        id: uuidv4(),
        username: req.body.username,
        organization_id: organization.id,
        email: req.body.email,
        password: hashedPassword,
      });
      return res.send(organizationMember);
    }
    
  }catch(error){
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    })
  }
});

router.get("/users", async (req, res) => {
  const users = (await findQuery(IndividualUser).build(req.query)).map((user) => ({...user, type: "iUser"}));
  const orgMembers = (await findQuery(OrganizationMember).build(req.query)).map((item) => ({...item, type: "orgMember"}));
  const orgLeads = (await findQuery(User).build(req.query)).map((item) => ({...item, type: "orgLead"}));
  return res.send([...users, ...orgMembers, ...orgLeads]);
});

//signing up as an organization member
router.post("/signuporganizationmember",  async (req, res) => {
  console.log(req.body);
  const organization = await Organization.query().where("name", req.body.organization).first();
  console.log(organization);
  console.log(organization.id);
  try{
    //inserts a new organization member
    const organizationMember = await OrganizationMember.query().insert({
    id: uuidv4(),
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  return res.send(organizationMember);
  }catch(error){
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    })
  }
});

//search the organizations when signing up as organization member
router.get("/signuporganizationmember", async (req, res) => {
  // Perform search query using the searched item from the nav/search bar
  const organization = await findQuery(Organization).build(req.query);
  // Respond with the search result
  return res.send(organization);
});

// Search for all organizations
router.get("/organizations/search", async (req, res) => {
  // Perform search query using the searched item from the nav/search bar
  const organizations = await findQuery(Organization).build(req.query);
  // Respoond with the search result
  return res.send(organizations);
});

// Search for organization by name
router.get("/organizations/:name", async (req, res) => {
  const organizationName = req.params.name;
  // Perform search query and store result
  const organization = await Organization.query()
    .where("name", organizationName)
    .first(); // Get the first result only

  // Respond with the search result
  return res.send(organization);
});

// Search for organization by id
router.get("/organizations/:organizationId", async (req, res) => {
  const organizationID = req.params.Id;
  try{
    const organization = await Organization.query().findById(organizationID);

    return res.send(organization)
  }catch(error){
    console.dir(error)

    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

// Patch changes for organization by id
router.patch("/organizations/:organizationId", async (req, res) => {
  const organizationID = req.params.Id;
  try{
    const organization = await Organization.query().patch({
      name: req.body.name,
      address: req.body.address,
      description: req.body.description
    }).findById(organizationID);

    return res.send(organization)
  }catch(error){
    console.dir(error)

    return res.status(500).json({
      message:'Internal Error'
    })
  }
});

// Search for all users
router.get("/users/search", async (req, res) => {
  //finds all organization leads
  const users = await findQuery(User).build(req.query);

  // Respond with the search result
  res.send(users);
});

//search bar for documents
router.get("/users/:userId/documents/search", async (req, res) => {
  //finds all documents that fulfill the query
  const docs = await findQuery(Document).build(req.query).where("user_id", req.params.userId);
  // Respond with the search result
  res.send(docs);
});

//insert a new document
router.post("/users/:userId/documents/", upload.fields([{ name: "file", maxCount: 1 }]),async (req, res) => {
  const indiv = await IndividualUser.query().where("id", req.params.userID).first();
  console.log(indiv);
  try{
    //uploads the documents
    const document = await Document.query().insert({
      id: uuidv4(),
      user_id: indiv.id,
      name: req.body.name,
      description: req.body.description,
      url: req.files.file[0].path,
    });
    console.log(document);
    return res.send(document);
  //catching errors
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    })
  }
});

//returns a list of documents the user has
router.get("/users/:userId/documents", async (req, res) => {
  //checks the document table for the user's documents
  const documents = await Document.query().where("user_id", req.params.userId);
  //returns the list of documents
  res.send(documents);
});

//returns a document that the user wants to edit
router.get("/users/:userId/documents/:id", async (req, res) => {
  //checks the document table for the specific document
  const document = await Document.query().where("id", req.params.id).first();
  //returns the document object
  res.send(document);
});

//updates the specific document
router.patch("/users/:userId/documents/:id",upload.fields([{ name: "file", maxCount: 1 }]),async (req, res) => {
  try{
    //update the document with the edited information
    const updateDoc = await Document.query().update(
      {name: req.body.name, description: req.body.description, url: req.files.file[0].path}
    ).where("id", req.params.id);
    return res.send(updateDoc);
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    })
  }
});

//deletes a specified document
router.delete("/users/:userId/documents/:id", async (req, res) => {
  try{
    //deletes the document
    const doc = await Document.query().delete().where("id", req.params.id).first();
    return res.send(doc);
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    })
  }
});

//search bar for packages
router.get("/users/:userId/packages/search", async (req, res) => {
  //finds all packages that fulfill the query
  const packs = await findQuery(Package).build(req.query).where("user_id", req.params.userId);
  // Respond with the search result
  res.send(packs);
});

//inserting a package
router.post("/users/:userId/packages/", async (req, res) => {
  const indiv = await IndividualUser.query().where("id", req.params.userId).first();
  console.log(indiv);
  try{
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
  //catching errors
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message:'Internal Error when inserting into database'
    })
  }
});

//gets the list of packages the user has
router.get("/users/:userId/packages/", async (req, res) => {
  console.log("req: " + JSON.stringify(Object.keys(req)))
  console.log("session1: " + JSON.stringify(req.session))
  console.log("session2: " + JSON.stringify(req.session))
  console.log("id: " + req.sessionID)
  //checks the package table for the user's packages
  const packages = await Package.query().where("user_id", req.params.userId);
  //returns the list of packages
  res.send(packages);
});

// router.get("/users/", async (req, res) => {
//   const homeLogin = await IndividualUser.query().where("email", req.body.email);

//   res.send(homeLogin);
// });

module.exports = router;
