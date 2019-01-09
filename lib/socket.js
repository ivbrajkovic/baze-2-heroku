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
  const io = require("socket.io")(serverHttps);

  let conn_count = 0;
  let db_tables = [];

  // db.products
  //   .allTablesDB()
  //   .then(data => {
  //     //console.log(data[0].naziv);
  //     data[0].naziv.forEach(element => {
  //       db_tables.push(element);
  //     });
  //     logit.warn("(socket.js) TABLICE:", db_tables);
  //   })
  //   .catch(function(error) {
  //     logit.error("(socket.js) ERROR:", error);
  //     // socket.emit("info", error.message);
  //   });

  io.on("connection", function(socket) {
    ++conn_count;
    logit.warn("(socket.js) CLIENT:", `Client connected, id: ${socket.id}`);
    socket.emit("hello", {
      server: `Hello from server, client num: ${conn_count}`
    });
    socket.on("hello", function(data) {
      logit.info("(socket.js) HELLO:", data);
    });

    socket.on("command", function(data, callback) {
      logit.info("(socket.js) SQL COMMAND:", data.data);

      switch (data.mode) {
        case "admin":
          db.products
            .adminTables(data.data)
            //.then(onDataHandler)
            .then(data => {
              logit.warn_2("(socket.js) ADMIN DATA DB 1:\n", data);

              if (data == false) {
                data.push("ok");
                socket.emit("info", data);
              } else {
                socket.emit("data", format_data(data));
              }
            })
            .catch(onErrorHandler);
          break;

        case "manage":
          logit.info("(socket.js) MODE:", data);

          // Get all manage tables
          db.products
            .table_all_manage()
            .then(onDataHandler)
            .catch(onErrorHandler);
          break;

        case "update":
          logit.info("(socket.js) MODE:", data);

          // Update row from table
          db.products
            .updateRow(data.data)
            .then(onDataHandler)
            .catch(onErrorHandler);
          break;

        case "delete":
          logit.info("(socket.js) MODE:", data);

          // Delete row from table
          db.products
            .deleteRow(data.data)
            .then(onDataHandler)
            .catch(onErrorHandler);
          break;

        case "add":
          logit.info("(socket.js) MODE:", data);

          // console.log("3.: " + data.id);
          // callback("1.: " + data.id);

          // insert row into table
          db.products
            .insertRow(data.data)
            // .then(onDataHandler)
            .then(ret => {
              // console.log("(socket.js) ID: ", ret);
              // socket.emit("info", ret);
              console.log("3.: " + data.id);
              data.ret = ret;
              callback(data);
            })
            .catch(onErrorHandler);
          break;

        default:
          break;
      }

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

      //db.multi(comm)
      //promise.then(dataHandler).catch(errorHandler);
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
