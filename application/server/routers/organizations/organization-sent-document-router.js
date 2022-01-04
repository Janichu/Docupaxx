/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
// Imports the database Models
const SentDocument = require("../../models/SentDocument");
const SentPackage = require("../../models/SentPackage");
//
const { findQuery } = require("objection-find");
const { route } = require("../../web-router");
const { getKeyFromUrl, uploadFile, downloadFile } = require("../../s3");

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

// Get a SentDocument of a SentPackage (& Org) (Note: doesn't really need packageId)
router.get(
  "/organizations/:organizationId/sentDocuments/:sentPackageId/:sentDocumentId",
  async (req, res) => {
    const sentDocument = await SentDocument.query()
      .where("sentPackage_id", req.params.sentPackageId)
      .where("id", req.params.sentDocumentId)
      .first()
      .catch((error) => {
        console.dir(error);
        return res.send(
          500,
          json({
            message: "Internal Error",
          })
        );
      });

    return res.send(sentDocument);
  }
);

// Get all SentDocuments of a SentPackage (& Org)
router.get(
  "/organizations/:organizationId/sentDocuments/:sentPackageId",
  async (req, res) => {
    const sentDocuments = await SentDocument.query()
      .where("sentPackage_id", req.params.sentPackageId)
      .catch((error) => {
        console.dir(error);
        return res.send(
          500,
          json({
            message: "Internal Error",
          })
        );
      });

    return res.send(sentDocuments);
  }
);

module.exports = router;
