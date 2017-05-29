"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const session    = require("express-session");
app.use(session({secret : 'mysecretword'}));


// Knex Querrying powers of wonder //
const db = require('./db/queries')(knex);


// Seperated Routes for each Resource

const loginRoutes = require("./routes/login");
const resourceRoutes = require("./routes/new_resource");
const registrationRoutes = require("./routes/registration");
const userProfileRoutes = require("./routes/userprofile");
const commentRoutes = require("./routes/comments");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
// The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));

app.use(express.static("public"));

// MOUNT ALL RESOURCE ROUTES HERE //

app.use("/login", loginRoutes(knex));
app.use("/new_resource", resourceRoutes(knex));
app.use("/register", registrationRoutes(knex));
app.use("/comment", commentRoutes(knex));


// Home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});


app.use("/resources", (req, res) => {
    knex
      .select("*")
      .from("resources")
      .then((results) => {
        res.render('resources',{resources:results});
    });
});


app.use("/users", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((users) => {
        res.render('users',{users:users});
    });
});


// displays USER page //
app.use("/Users/userprofile", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((userprofile) => {
        res.render('user',{user:userprofile});
    });
});



app.listen(PORT, () => {
  console.log("Resource Wall is listening on port " + PORT);
});
