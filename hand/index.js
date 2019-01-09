"use strict";

const logit = require("../lib").log;

// Generic GET handler;
module.exports = {
  GET_OLD: function(url, app, handler) {
    app.get(url, (req, res) => {
      handler(/*req*/)
        .then(data => {
          res.render("all", {
            success: true,
            db_data: data
          });
        })
        .catch(error => {
          res.json({
            success: false,
            error: error.message || error
          });
        });
    });
  },
  GET_OLD_2: (res, view, handler) => {
    console.log("(hand)", handler);
    if (handler !== undefined) {
      handler()
        .then(data => {
          logit.warn_2("(hand) DATA:", data);
          res.render(view, {
            success: true,
            db_data: data
          });
        })
        .catch(error => {
          logit.error("(hand) ERROR:", error);
          res.json({
            success: false,
            error: error.message || error
          });
        });
    } else {
      console.log("(hand)", view);
      res.render(view);
    }
  },
  GET: (res, view, handler) => {
    if (handler !== undefined) {
      handler()
        .then(data => {
          logit.warn_2("(hand) DATA:", data);
          logit.warn_2("(hand) DATA LENGHT:", data.length);
          res.render(view, {
            success: true,
            db_data: data
          });
        })
        .catch(error => {
          logit.error("(hand) ERROR:", error);
          res.json({
            success: false,
            error: error.message || error
          });
        });
    } else {
      logit.warn_2("(hand) DATA:", view);
      res.render(view);
    }
  }
};
