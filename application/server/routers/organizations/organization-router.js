/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// Imports the database Models
const Address = require("../../models/Address");
const BankOrganization = require("../../models/BankOrganization");
const GovernmentOrganization = require("../../models/GovernmentOrganization");
const InsuranceOrganization = require("../../models/InsuranceOrganization");
const Organization = require("../../models/Organization");
const OrganizationLead = require("../../models/OrganizationLead");
const OtherOrganization = require("../../models/OtherOrganization");
const SchoolOrganization = require("../../models/SchoolOrganization");
const User = require("../../models/User");
//
const { findQuery } = require("objection-find");
const Joi = require("joi");
const multer = require("multer");
const bcrypt = require("bcrypt");
const { uploadFile } = require("../../s3");

const path = require("path");
const OrganizationMember = require("../../models/OrganizationMember");

router.use(bodyParser.json());
router.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

// Storage of the files
const storage = multer.diskStorage({
  //changes the location of the uploads
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../../uploads");
  },
  //changes the way the files are named
  filename: (req, file, cb) => {
    //.replace(/:/g, '-') is needed for Windows because it doesn't let you create
    //files with a colon (:).
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

// upload the image to the server
const upload = multer({
  storage: storage,
  // fileFilter will filter all file whose extension is not image extension
  // if not image extension, it will prevent the file to be uploaded to s3 and database
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    console.log("ext: " + ext);
    if (
      ext !== ".jpg" &&
      ext !== ".JPG" &&
      ext !== ".jpeg" &&
      ext !== ".JPEG" &&
      ext !== ".png" &&
      exit !== ".PNG"
    ) {
      return cb(
        new Error(
          "Only Image extensions such as JPEG, JPG, PNG can be uploaded as images"
        )
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

// Default Organization Types
const builtInTypeFields = {
  Bank: BankOrganization,
  Government: GovernmentOrganization,
  Insurance: InsuranceOrganization,
  School: SchoolOrganization,
};
const builtInTypes = Object.keys(builtInTypeFields);

const addExtensions = async (organizations) => {
  // Gets the subclass table
  const subclassTable = [
    { type: "bank", model: BankOrganization },
    { type: "government", model: GovernmentOrganization },
    { type: "insurance", model: InsuranceOrganization },
    { type: "school", model: SchoolOrganization },
  ];

  // List of existing types
  const existingTypes = subclassTable.map((field) => field.type);

  // Get the subclass map
  const subclassMap = {};
  for (let i = 0; i < existingTypes.length; i++) {
    subclassMap[existingTypes[i]] = subclassTable[i];
  }

  // Collect Organization subclass objects
  for (let i = 0; i < subclassTable.length; i++) {
    const subclassField = subclassTable[i];
    subclassField.objects = await findQuery(subclassField.model).build({});
  }

  // Put all organizations into a Map
  const organizationIdMap = {};
  for (let i = 0; i < organizations.length; i++) {
    organizationIdMap[organizations[i].id] = organizations[i];
  }

  // Place all types and extensions into each user
  for (let i = 0; i < subclassTable.length; i++) {
    const subclassField = subclassTable[i];
    const objects = subclassField.objects;
    for (let j = 0; j < objects.length; j++) {
      const object = objects[j];
      organizationIdMap[object.organization_id].type = subclassField.type;
      organizationIdMap[object.organization_id].extension = object;
    }
  }

  return 0;
};

/***************************************************************
 * MAIN ORGANIZATION METHODS
 *****************************************************************/

// Get the names of all organizations
router.get("/organizations/names", async (req, res) => {
  try {
    const names = await Organization.query().select("name");

    return res.send(names.map((object) => object.name));
  } catch (error) {
    console.dir(error);
    return res.send(
      500,
      json({
        message: "Internal Error",
      })
    );
  }
});

// Get the names of all organizations
router.get("/organizations/types", async (req, res) => {
  try {
    const otherTypes = await OtherOrganization.query().distinct("type");

    const types = [...builtInTypes, otherTypes];

    return res.send(types);
  } catch (error) {
    console.dir(error);

    return res.send(
      500,
      json({
        message: "Internal Error",
      })
    );
  }
});

router.get("/organizations/schoolify", async (req, res) => {
  const organizations = await findQuery(Organization).build({});

  const schools = await findQuery(SchoolOrganization).build({});

  res.send({ ol: organizations.length, schools: schools.length });
});

// Search for all organizations
router.get("/organizations/search", async (req, res) => {
  try {
    // Gets the query type
    const queryType = req.query.type;

    // Perform search query using the searched item from the nav/search bar
    const organizations = await findQuery(Organization).build({});

    // Adds a "type" attribute to every organization (which is it's type in lowercase)
    // Don't worry about the "extension" part
    const x = await addExtensions(organizations);


  if (!queryType || queryType.length == 0 || queryType == "all") {
    return res.send(organizations)
  }

  return res.send(organizations.filter((org) => org.type == queryType));
 } catch (error) {
    console.dir(error);

    return res.send(
      500,
      json({
        message: "Internal Error",
      })
    );
  }
});

// Search for organization by name
router.get("/organizations/getbyname/:name", async (req, res) => {
  const organizationName = req.params.name;
  try {
    // Perform search query and store result
    const organization = await Organization.query()
      .where("name", organizationName)
      .first(); // Get the first result only

    // Respond with the search result
    return res.send(organization);
  } catch (error) {
    console.dir(error);

    return res.send(
      500,
      json({
        message: "Internal Error",
      })
    );
  }
});

// Search for organization by id
router.get("/organizations/:organizationId", async (req, res) => {
  const organizationID = req.params.organizationId;
  try {
    const organization = await Organization.query().findById(organizationID);

    return res.send(organization);
  } catch (error) {
    console.dir(error);

    return res.status(500).json({
      message: "Internal Error",
    });
  }
});

// Search for organization by name (TODO)
router.get("/organizations/getbyorganizationname", async (req, res) => {
  console.log(req.body);
  try {
    const organizationName = req.query.organizationName;
    const organizations = await Organization.query().where(
      "name",
      organizationName
    );

    return organizations;
  } catch (error) {
    console.dir(error);

    return res.status(500).json({
      message: "Internal Error",
    });
  }
});

// Create an Organization
router.post("/organizations", async (req, res) => {
  try {
    // Default pictures for organization
    const thumbnail =
      "https://images.pexels.com/photos/256444/pexels-photo-256444.jpeg?h=750&w=1260";
    const image =
      "https://images.pexels.com/photos/256444/pexels-photo-256444.jpeg?h=750&w=1260";

    // Create Organization and insert into the database
    const address = await Address.query().insert({
      id: uuidv4(),
      street: "1600 Holloway",
      city: "San Francisco",
      country: "US",
      zip: "94112",
    });

    // Create Organization and insert into the database
    const organization = await Organization.query().insert({
      id: uuidv4(),
      name: req.body.name,
      address_id: address.id,
      thumbnail: thumbnail,
      image: image,
    });

    // Gets the Organization Type to be created
    const type = req.body.type.toLowerCase().trim();

    // Gets the subclass table
    const subclassTable = [
      { type: "bank", model: BankOrganization },
      { type: "government", model: GovernmentOrganization },
      { type: "insurance", model: InsuranceOrganization },
      { type: "school", model: SchoolOrganization },
    ];

    // List of existing types
    const existingTypes = subclassTable.map((field) => field.type);

    // Get the subclass map
    const subclassMap = {};
    for (let i = 0; i < existingTypes.length; i++) {
      subclassMap[existingTypes[i]] = subclassTable[i];
    }

    // If the entered type is existing, then insert it to the appropriate table
    if (existingTypes.includes(type)) {
      const subclassObject = await subclassMap[type].model.query().insert({
        id: uuidv4(),
        organization_id: organization.id,
      });
      return res.send(organization);
    }

    // If the entered type is new, then insert it to the otherOrganizationTable
    const subclassObject = await OtherOrganization.query().insert({
      id: uuidv4(),
      organization_id: organization.id,
      type: req.body.type,
    });
    return res.send(organization);
  } catch (error) {
    console.dir(error);

    return res.status(500).json({
      message: "Internal error",
    });
  }
});

// Create an Organization Lead of an Organization
router.post("/organizations/:orgId/users/:memberType", async (req, res) => {
  try {
    const orgId = req.params.orgId;
    const memberType = req.params.memberType;
    // Check the type
    // If org lead
    const org = await Organization.query().where("id", orgId).first();

    // Creates the user
    if (memberType == "orgLead") {
      const user = await User.query().insert({
        id: uuidv4(),
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        is_enabled: 1,
      });
      // Creates the org lead attachment
      const orgLead = await OrganizationLead.query().insert({
        id: uuidv4(),
        user_id: user.id,
        organization_id: org.id,
      });
    } else if (memberType === "orgMember") {
      const user = await User.query().insert({
        id: uuidv4(),
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        is_enabled: 0,
      });
      const orgMember = await OrganizationMember.query().insert({
        id: uuidv4(),
        user_id: user.id,
        organization_id: org.id,
      });
    }
    return res.send(user);
  } catch (error) {
    console.dir(error);
    return res.status(500).json({
      message: "Internal error",
    });
  }
});

// Patch changes for organization by id
// It patches the name, description, and it changes the image url
router.patch(
  "/organizations/:organizationId",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const organizationID = req.params.organizationId;
    try {
      console.log("Patching");
      console.log("BODY: " + JSON.stringify(req.body));
      console.log("FILE: " + JSON.stringify(req.files));
      const uploadedFile = await uploadFile(req.files.image[0]);
      console.log(uploadedFile.Location);
      req.body.image = uploadedFile.Location;
      req.body.thumbnail = uploadedFile.Location;
      const organization = await Organization.query()
        .patch(req.body)
        .findById(organizationID); //

      return res.send({});
    } catch (error) {
      console.dir(error);

      return res.status(500).json({
        message: "Internal Error",
      });
    }
  }
);

module.exports = router;
