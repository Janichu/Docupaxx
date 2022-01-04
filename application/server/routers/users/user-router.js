/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
// Imports the database Models
const Admin = require("../../models/Admin");
const IndividualUser = require("../../models/IndividualUser");
const Organization = require("../../models/Organization");
const OrganizationLead = require("../../models/OrganizationLead");
const OrganizationMember = require("../../models/OrganizationMember");
const User = require("../../models/User");
//
const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require("multer");
const bcrypt = require("bcrypt");

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
router.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

/******************************************************************
 * MAIN USER METHODS
 *****************************************************************/

const sgMail = require("@sendgrid/mail");

router.post("/users/sendemail", async (req, res) => {
  console.log("send email body: " + JSON.stringify(req.body));
  const { firstName, lastName, email, description } = req.body;
  sgMail.setApiKey("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");
  const msg = {
    to: req.body.email,
    from: "docupaxxservices@gmail.com",
    subject: "Contact US Message",
    text: "hi",
    html: `<strong>First Name "${firstName}" and LastName "${lastName}" and email "${email}" \n description "${description}"</strong>`,
  };
  console.log("About to send message: " + JSON.stringify(msg));

  sgMail
    .send(msg)
    .then((result) => {
      console.log("Message sent!");
      res.send({});
    })
    .catch((err) => {
      console.log("error: ", err);
      res.status(401).json({
        success: false,
      });
    });
});

const stripe = require("stripe")(
  "sk_test_51Isxi9LJUNZhYxjyfuAfxvUP8iqFVlWJRjDQm47cTKndzvOa3vSU4500QKFwrK5Pz7KyEq07jthCb5dsIdcscseJ00E9YBXOYC"
);

router.post("/users/sendpayment", async (req, res) => {
  console.log("send payment body: " + JSON.stringify(req.body));
  const { product, token } = req.body;
  console.log("product", product);
  console.log("Price", product);

  return stripe.customers
    .create({
      email: token.email,
      //source: token.id
    })
    .then((customer) => {
      console.log("CREATION WORKED");
      stripe.charges.create({
        amount: product.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchase of product.name`,
        shipping: {
          name: token.card.name,
          address: {
            country: token.card.address_country,
          },
        },
      });
    })
    .then((result) => {
      console.log("CHARGED WORKED");
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("error:", err);
      res.status(401).json({
        success: false,
      });
    });
});

// Search for all users
router.get("/users/search", async (req, res) => {
  //finds all organization leads
  const users = await findQuery(User).build(req.query);

  // Respond with the search result
  res.send(users);
});

// Get all users in the system
router.get("/users", async (req, res) => {
  try {
    // Users
    const users = await findQuery(User).build(req.query);

    // Table of User subclasses
    const subclassTable = [
      { type: "iUser", model: IndividualUser },
      { type: "orgMember", model: OrganizationMember },
      { type: "orgLead", model: OrganizationLead },
      { type: "admin", model: Admin },
    ];

    // Collect User subclass objects
    for (let i = 0; i < subclassTable.length; i++) {
      const subclassField = subclassTable[i];
      subclassField.objects = await findQuery(subclassField.model).build(
        req.query
      );
    }

    // Put all users into a Map
    const userIdMap = {};
    for (let i = 0; i < users.length; i++) {
      userIdMap[users[i].id] = users[i];
    }

    // Place all types into each user
    for (let i = 0; i < subclassTable.length; i++) {
      const subclassField = subclassTable[i];
      const objects = subclassField.objects;
      for (let j = 0; j < objects.length; j++) {
        const object = objects[j];
        userIdMap[object.user_id].type = subclassField.type;
      }
    }

    // Send the list of users
    return res.send([...users]);
  } catch (error) {
    console.dir(error);
    return res.send(
      500,
      json({
        message: "Internal Error",
      })
    );
  }
  // console.log(users);
  // console.log(orgMembers);
  // console.log(orgLeads);
  // return res.send([...users, ...orgMembers, ...orgLeads]);
});

// Get user information for login
router.get("/users/login", async (req, res) => {
  console.log("Login");
  const passedUsers = [];
  try {
    // Users
    const users = await findQuery(User).build({});

    // Table of User subclasses
    const subclassTable = [
      { type: "iUser", model: IndividualUser },
      { type: "orgMember", model: OrganizationMember },
      { type: "orgLead", model: OrganizationLead },
      { type: "admin", model: Admin },
    ];

    // Collect User subclass objects
    for (let i = 0; i < subclassTable.length; i++) {
      const subclassField = subclassTable[i];
      subclassField.objects = await findQuery(subclassField.model).build({});
    }

    // Put all users into a Map
    const userIdMap = {};
    for (let i = 0; i < users.length; i++) {
      userIdMap[users[i].id] = users[i];
    }

    // Place all types and extensions into each user
    for (let i = 0; i < subclassTable.length; i++) {
      const subclassField = subclassTable[i];
      const objects = subclassField.objects;
      console.log("F: " + JSON.stringify(subclassField));
      for (let j = 0; j < objects.length; j++) {
        const object = objects[j];
        userIdMap[object.user_id].type = subclassField.type;
        userIdMap[object.user_id].extension = object;
      }
    }

    // Checks al users if their password validates
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // Validate password
      if (
        user.email == req.query.email &&
        bcrypt.compareSync(req.query.password, user.password)
      ) {
        passedUsers.push(user);
      }
    }

    // Send all valid users
    // res.send(passedUsers);
  } catch (error) {
    console.dir(error);
    return res.send(
      500,
      json({
        message: "Internal Error",
      })
    );
  }
  return res.send(passedUsers);
});

// Get all users that have the given username
router.get("/users/getbyusername", async (req, res) => {
  console.log(req.body);

  const username = req.query.username;
  const users = await User.query()
    .where("username", username)
    .catch((error) => {
      console.dir(error);
      return res.send(
        500,
        json({
          message: "Internal Error",
        })
      );
    });

  return res.send(users);
});

router.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const individualUser = await IndividualUser.query().findById(userId);
    const user = await User.query().findById(individualUser.user_id);

    return res.send(user);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Error",
    });
  }
});

// Search the organizations when signing up as organization member
router.get("/users/signuporganizationmember", async (req, res) => {
  // Perform search query using the searched item from the nav/search bar
  const organization = await findQuery(Organization)
    .build(req.query)
    .catch((error) => {
      console.dir(error);
      return res.send(
        500,
        json({
          message: "Internal Error",
        })
      );
    });

  // Respond with the search result
  return res.send(organization);
});

// Sign up an Individual User
router.post("/users/signup", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.query().insert({
      id: uuidv4(),
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      is_enabled: req.body.is_enabled,
    });

    const individualUser = await IndividualUser.query().insert({
      id: uuidv4(),
      user_id: user.id,
    });

    sgMail.setApiKey("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");
    const msg = {
      to: req.body.email,
      from: "docupaxxservices@gmail.com",
      subject: "Email Verification",
      text: "Hello",
      html: `<strong>Go the website and after the website name type: "/verification/${user.id}"</strong>`,
    };
    console.log("About to send message: " + JSON.stringify(msg));

    sgMail
      .send(msg)
      .then((result) => {
        console.log("Message sent!");
        res.send({});
      })
      .catch((err) => {
        console.log("error: ", err);
        res.status(401).json({
          success: false,
        });
      });

    return res.send(user);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Error",
    });
  }
});

router.patch("/users/enable", async(req, res) => {
  if (req.body.user_id) {
    const user = await User.query().where("id", req.body.user_id).first()
    const id = user.id
    const patched = await User.query().patch({ is_enabled: 1 }).findById(id)
    return res.send(patched)
  }
  const user = await User.query().where("email", req.body.email).first()
  const id = user.id
  const patched = await User.query().patch({ is_enabled: 1 }).findById(id)
  return res.send(patched)
})

router.patch("/users/:userId/update", async (req, res) => {
  const userId = req.params.userId;
  try {
    const individualUser = await IndividualUser.query().findById(userId);

    if (req.body.newPassword) {
      const user = await User.query()
        .patch({
          email: req.body.email,
          password: await bcrypt.hash(req.body.newPassword, 10),
        })
        .findById(individualUser.user_id);
      return res.send(user);
    } else {
      const user = await User.query()
        .patch({
          email: req.body.email,
        })
        .findById(individualUser.user_id);
      return res.send(user);
    }
  } catch (error) {
    return res.sendStatus(500).json({
      message: "Internal Error",
    });
  }
});

module.exports = router;
