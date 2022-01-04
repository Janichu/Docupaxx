/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
// Imports the database Models
const Organization = require("../../models/Organization");
const OrganizationLead = require("../../models/OrganizationLead");
const OrganizationMember = require("../../models/OrganizationMember");
const User = require("../../models/User");
//
const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require("multer");

const { route } = require("../../web-router");

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

/***************************************************************
 * MAIN ORGANIZATION-USER METHODS
 *****************************************************************/

// Get all Organization members and Organziation Lead for an Organization
router.get("/organizations/:organizationId/users", async (req, res) => {
  console.log("calling org member search");
  const orgId = req.params.organizationId;
  console.dir(req.params);
  try {
    // Table of User subclasses
    const subclassTable = [
      { type: "orgMember", model: OrganizationMember },
      { type: "orgLead", model: OrganizationLead },
    ];

    // // Collect User subclass objects and userIds with org id
    const userIds = [];
    for (let i = 0; i < subclassTable.length; i++) {
      const subclassField = subclassTable[i];
      subclassField.objects = await subclassField.model
        .query()
        .where("organization_id", orgId);
      for (let j = 0; j < subclassField.objects.length; j++) {
        userIds.push(subclassField.objects[j].user_id);
      }
    }

    // Collect Users from the relevant pool
    if (userIds.length <= 0) {
      return res.send([]);
    }
    let userQuery = User.query().where("id", userIds[0]);
    for (let i = 1; i < userIds.length; i++) {
      userQuery = userQuery.orWhere("id", userIds[i]);
    }
    const users = await userQuery;

    // // Put all users into a Map
    // const userIdMap = {};
    // for (let i = 0; i < users.length; i++) {
    //   userIdMap[users[i].id] = users[i];
    // }

    // console.log(userIdMap, "---------userIdMap");
    // Place all types into each user
    // for (let i = 0; i < subclassTable.length; i++) {
    // const subclassField = subclassTable[i];
    // const objects = subclassField.objects;
    // for (let j = 0; j < objects.length; j++) {
    //   const object = objects[j];
    //   userIdMap[object.user_id].type = subclassField.type;
    // }
    // }

    // Send the list of users
    return res.send([...users]);
  } catch (error) {
    console.dir(error);

    return res.status(500).json({
      message: "Internal Error",
    });
  }
});

module.exports = router;
