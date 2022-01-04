/**
 * web-router.js - This file will be mounted to the app to be able to serve the webpage build folder
 */
const express = require("express");
const path = require("path");
const router = express.Router();

router.use(express.static(path.join(__dirname, "../web/build")));

router.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../web/build", "index.html"));
});

module.exports = router;
