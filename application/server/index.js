/**
 * index.js - This is the main server file
 */
const express = require("express");
const { Model } = require("objection");
const knexfile = require("./knexfile");
const webRouter = require("./web-router");
const jsonServerRouter = require("./json-server-router");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

// Connect to the database (initialize knex)
const knex = require("knex")(knexfile.development);
Model.knex(knex); // Give the knex instance to Objection

const app = express();

// app.use(express.json())

// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth: {
//     api_key: SENDGRID_API
//   }
// }))

// app.post('/send', (req, res) => {
//   const { name, email, message, subject } = req.body
//   transporter.sendMail({
//     to: `rigog02@live.com`,
//     from: email,
//     subject: subject,
//     html: `<h3>${name}</h3 > <p>${message}</p>`
//   })
//     .then(resp => { res.json({ resp }) })
//     .catch(err => { console.log(err) })
// })

// app.use(bodyParser.json());
// app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   // res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });
// app.get("/api", (req, res, next) => {
//   res.send('API Status')
// });

// app.post("/api/contactUs", (req, res, next) => {

//   console.log(req.body);

//   sgMail.setApiKey(SENDGRID_API)
//   const msg = {
//     to: "rigog02@live.com",
//     from: req.body.email,
//     subject: 'Contact US Message',
//     text: req.body.message,
//     html: `<strong>First Name "${firstName}" and LastName "${lastName}" and email "${email}" \n description "${description}</strong>`,
//   };

//   sgMail.send(msg)
//     .then(result => {

//       res.status(200).json({
//         success: true
//       });

//     })
//     .catch(err => {

//       console.log('error: ', err);
//       res.status(401).json({
//         success: false
//       });

//     });
// })

app.use(cookieParser());
app.use(
  session({
    key: "key123",
    store: new knexSessionStore({
      knex: knex,
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 1000 * 60 * 60,
    }),
    secret: "secret123",
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      clearInterval: 1000 * 60 * 60,
    },
  })
);

// Print incoming requests
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  if (req.params) {
    console.dir(req.params);
  }
  if (req.body) {
    console.dir(req.body);
  }
  next();
});

// Routes
app.use("/mock", jsonServerRouter);
//app.use("/api", require("./routers/sessions/session-router"));
app.use(
  "/api/organizations",
  require("./routers/organizations/organization-router")
);
app.use("/api/quiz", require("./routers/quiz/quiz-router"));
app.use("/api/sessions", require("./routers/sessions/session-router"));
app.use("/api/users", require("./routers/users/user-router"));

const routes = [
  "./routers/admins/admin-organization-router",
  "./routers/admins/admin-user-router",
  "./routers/admins/admin-question-router",
  "./routers/files/file-router",
  "./routers/organizations/organization-ar-router",
  "./routers/organizations/organization-arp-router",
  "./routers/organizations/organization-router",
  "./routers/organizations/organization-user-router",
  "./routers/organizations/organization-sent-package-router",
  "./routers/organizations/organization-sent-document-router",
  "./routers/quiz/quiz-router",
  "./routers/sessions/session-router",
  "./routers/users/user-document-router",
  "./routers/users/user-organization-router",
  "./routers/users/user-package-router",
  "./routers/users/user-router",
  "./routers/users/user-sent-package-router",
  "./routers/users/user-sent-document-router",
];

for (let i = 0; i < routes.length; i++) {
  app.use("/api", require(routes[i]));
}

app.use("/", webRouter);
/*
 */

app.use((req, res, next) => {
  console.log(JSON.stringify(req.session));
  next();
});

const port = process.env.PORT || 3000;

// const SENDER_EMAIL = `rigog02@live.com`
// const RECIEVER_EMAIL = 'rigorojas158@gmail.com'
// sgMail.setApiKey = process.env.SENDGRID_API_KEY

// const msg = {
//   to: SENDER_EMAIL,
//   from: RECIEVER_EMAIL,
//   subject: 'Contact US Message',
//   text: `First Name "${firstName}" and LastName "${lastName}" and email "${email}" \n description "${description}"`,
//   html: `<strong>First Name "${firstName}" and LastName "${lastName}" and email "${email}" \n description "${description}</strong>`,
// };

// sgMail.send(msg);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'https://api.sendgrid.com/v3/mail/send');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// })

// const http = require("http");

// const PORT = 5000; // Defining PORT

// http.createServer((req, res) => {

//   // Output Hello World on HTML page
//   res.write("<h1>Hello World!</h1>");
//   res.end();
// })

//   // Initializing server
//   .listen(PORT, () => console.log(`Server running on PORT : ${PORT}`));
