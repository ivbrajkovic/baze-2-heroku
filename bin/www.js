#!/usr/bin/env node

"use strict";

/**
 * Module dependencies.
 */
const app = require("../app");
const logit = require("../lib").log;
const conf = require("../config.json");

// If port is not set into env set it through conf file
const PORT = process.env.PORT || conf.ports.http;

/**
 * HTTP server on connect redirect client to secure HTTPS
 */
const server = require("http")
  .createServer(app, function(req, res) {})
  .on("error", onError)
  .listen(PORT, () => {
    logit.info("(www.js) HTTP:", `Server listening on ${PORT}`);
  });

/**
 * Start socket server over http
 */
require("../lib").socket(server);

/**
 * Error handler
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  // Get server port
  let port = arguments[0].port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(port + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(port + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
