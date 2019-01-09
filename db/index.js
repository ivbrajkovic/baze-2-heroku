"use strict";

// Read connection settings from config file:
const conf = require("../config.json");

// loading all repositories
const repos = require("./repos");

// Extends db object to include products repos
const initOptions = {
  // query(e) {
  //   console.log("(db) QUERY:", e.query);
  // },
  extend(obj, dc) {
    obj.products = new repos.Products(obj, pgp);
  }
};

// Loading and initializing the library:
const pgp = require("pg-promise")(initOptions);

// For debug
const monitor = require("pg-monitor");
monitor.attach(initOptions);
monitor.setTheme("matrix");

// Preparing the connection details:
// postgres://ivanbrajkovic:@localhost:5432/pivovara_test
// heroku pg:push postgres://ivanbrajkovic:@localhost:5432/pivovara_test DATABASE_URL --app vinarija
const conn =
  conf.database.db +
  "://" +
  conf.database.user +
  ":@" +
  conf.database.host +
  ":" +
  conf.database.port +
  "/" +
  conf.database.initial;

// Creating a new database instance from the connection details:
const db = pgp(process.env.DATABASE_URL || conn);

// Exporting the database object for shared use:
module.exports = db;
