#!/usr/bin/env node

"use strict";

/**
 * Module dependencies.
 */
const app = require("../app");
const logit = require("../lib").log;
const conf = require("../config.json");
// const fs = require("fs");
// const http = require("http");

// If port is not set into env set it through conf file
const PORT = process.env.PORT || conf.ports.http;

/**
 * HTTP server on connect redirect client to secure HTTPS
 */
const server = require("http")
  .createServer(app, function(req, res) {
    //   logit.warn(
    //     "REDIRECT: ",
    //     "Client redirect to https://127.0.0.1:" + conf.ports.https
    //   );
    //   res.writeHead(302, {
    //     Location:
    //       "https://" +
    //       req.headers["host"].split(":")[0] +
    //       ":" +
    //       conf.ports.https +
    //       req.url
    //   });
    //   res.end();
  })
  .on("error", onError)
  .listen(PORT, () => {
    logit.info("(www.js) HTTP:", `Server listening on ${PORT}`);
  });

// /**
//  * HTTPS needed key and certificates
//  */
// const options = {
//   key: fs.readFileSync(conf.ssl.key),
//   cert: fs.readFileSync(conf.ssl.cert),
//   ca: fs.readFileSync(conf.ssl.ca)
// };

// /**
//  * HTTPS listen on provided port, on all network interfaces.
//  */
// const serverHttps = https.createServer(options, app);
// serverHttps.on("error", onError).listen(conf.ports.https, () => {
//   // debugHttps("Server started at https://127.0.0.1:" + conf.ports.https);
//   logit.info_2(
//     "HTTPS:",
//     "Server started at https://127.0.0.1:" + conf.ports.https
//   );
// });

/**
 * Start socket server over ssl
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
