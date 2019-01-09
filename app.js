"use strict";

// Load libraries
const cookie_parser = require("cookie-parser");
const create_error = require("http-errors");
const express = require("express");
const logger = require("morgan");
const path = require("path");

const logit = require("./lib").log;
// const db = require("./db");

// Load rootes
const router = require("./routes");

// Main application
const app = express();

// View engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Global middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie_parser());

// Serve all public folder, needed for js and css files;
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  logit.warn(
    "(app.js) CLIENT:",
    `Client connected, id: ${req.connection.remoteAddress}`
  );
  next();
});

// Server routes
app.use("/", router);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(create_error(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error-view");
});

module.exports = app;
