"use strict";

/**
 * Db reference
 */
const db = require("../db");
const logit = require("./log");

/**
 * Setup socket server for real time update
 */
module.exports = function(serverHttps) {
  // Keep track of connected clients
  let conn_count = 0;

  // Create socket instance on http server
  const io = require("socket.io")(serverHttps);

  // On client connection handler
  io.on("connection", function(socket) {
    ++conn_count;
    logit.warn("(socket.js) CLIENT:", `Client connected, id: ${socket.id}`);

    // Custom handshake
    socket.emit("hello", {
      server: `Hello from server, client num: ${conn_count}`
    });
    socket.on("hello", function(data) {
      logit.info("(socket.js) HELLO:", data);
    });

    // On command received
    socket.on("command", function(data, callback) {
      logit.info("(socket.js) SQL COMMAND:", data.data);

      // If data is for admin or client
      switch (data.mode) {
        case "admin":
          db.products
            .adminTables(data.data)
            .then(data => {
              logit.warn_2("(socket.js) ADMIN DATA DB 1:\n", data);

              if (data == false) {
                data.push("ok");
                socket.emit("info", data);
              } else {
                // Custom format data received from db
                socket.emit("data", format_data(data));
              }
            })
            .catch(onErrorHandler);
          break;

        // Recquest all tables from db
        case "manage":
          logit.info("(socket.js) MODE:", data);

          // Get all manage tables
          db.products
            .table_all_manage()
            .then(onDataHandler)
            .catch(onErrorHandler);
          break;

        // Recquest for update row from table
        case "update":
          logit.info("(socket.js) MODE:", data);

          // Update row from table
          db.products
            .updateRow(data.data)
            .then(onDataHandler)
            .catch(onErrorHandler);
          break;

        // Recquest for delete row from table
        case "delete":
          logit.info("(socket.js) MODE:", data);

          // Delete row from table
          db.products
            .deleteRow(data.data)
            .then(onDataHandler)
            .catch(onErrorHandler);
          break;

        // Recquest for add row to table
        case "add":
          logit.info("(socket.js) MODE:", data);

          // insert row into table
          db.products
            .insertRow(data.data)
            .then(ret => {
              console.log("3.: " + data.id);
              data.ret = ret;
              callback(data);
            })
            .catch(onErrorHandler);
          break;

        // Exit if received invalid recques
        default:
          break;
      }

      // On data received from db
      function onDataHandler(data) {
        logit.warn_2("(socket.js) DATA DB 1:\n", data);

        if (data == false) {
          data.push("ok");
          socket.emit("info", data);
        } else {
          socket.emit("data", data);
        }
      }

      function onErrorHandler(error) {
        logit.error("(socket.js) ERROR:", error);
        socket.emit("info", error.message);
      }
    });

    socket.on("disconnect", function() {
      --conn_count;
      logit.warn("CLIENT:", `Client disconnected, id: ${socket.id}`);
    });

    socket.on("error", function() {
      --conn_count;
      logit.warn("(socket.js) CLIENT:", "Socket client error");
    });
  });
};

// Format data to custom JSON object,
// needed for view data on admin modal
function format_data(data) {
  console.log("data: ", data);
  let ret = [];

  for (let row of data) {
    let obj = {},
      tmp = {};

    obj.rows = [];
    obj.table = "";
    obj.columns = [];

    for (let key in row[0]) obj.columns.push(key);

    for (let cells of row) {
      let arr = [];
      for (let key in cells) arr.push(cells[key]);
      obj.rows.push(arr);
    }

    tmp.dummy = obj;
    ret.push(tmp);
  }
  console.log("ret: ", ret);
  return ret;
}
