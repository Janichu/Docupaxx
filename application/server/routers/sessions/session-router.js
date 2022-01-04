/**
 * api-router.js - This file contains all of the routes that are currently supported by Docupaxx
 */
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

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

// Loads the current session of the user
router.get("/sessions", async (req, res) => {
  console.log("req.session.id: " + JSON.stringify(req.sessionID));
  // If the user has no information on their session, then they get the info as if they have been signed out
  if (!req.session.locals) {
    console.log("no locals");
    req.session.locals = {
      type: "signedOut",
      user: "",
      userId: "",
      id: 1,
      dashboardToken: "",
      messageHeader: "",
      message: "",
      status: "",
      count: "",
    };
    // If new info added, the session saves its data
    req.session.save();
  }

  // Afterwards the relevant session data is sent to the frontend function calling it
  console.log("req.session.locals: " + JSON.stringify(req.session.locals));
  res.send([req.session.locals]);
});

// Modify the current session of the user
router.patch("/sessions/:id", async (req, res) => {
  console.log("req.session.id: " + JSON.stringify(req.sessionID));
  console.log("req.body: " + JSON.stringify(req.body));

  req.session.locals = req.body;
  console.log(req.session.locals);
  req.session.save();
  res.send([req.session.locals]);
});

console.log("session-router");

module.exports = router;
