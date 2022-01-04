const path = require("path");
const express = require("express");
const router = express.Router();
const jsonServer = require("json-server");
const jsonRouter = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

router.use(middlewares);
router.use(jsonServer.bodyParser);
router.use((req, res, next) => {
  if (req.body.organization_name) {
    req.body.name = req.body.organization_name;
    delete req.body.organization_name;
  }
  if (req.body.organization_address) {
    req.body.address = req.body.organization_address;
    delete req.body.organization_address;
  }
  if (req.body.organization_type) {
    req.body.type = req.body.organization_type;
    delete req.body.organization_type;
  }
  if (req.body.user_email) {
    req.body.email = req.body.user_email;
    delete req.body.user_email;
  }
  next();
});
router.use(
  jsonServer.rewriter({
    "/organizations/search\\?name:like=%:query%":
      "/organizations?name_like=:query",
    "/organizations/:id/users/:userId": "/users/:userId",
    "/organizations/:id/packages/:packageId": "/packages/:packageId",
    "/organizations/:id/applicants/:applicantId": "/applicants/:applicantId",
    "/users/:id/documents/:documentId": "/documents/:documentId",
    "/users/:id/packages/:packageId": "/packages/:packageId",
  })
);
router.use(jsonRouter);

module.exports = router;
