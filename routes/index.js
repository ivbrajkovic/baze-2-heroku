"use strict";

const db = require("../db");
const router = require("express").Router();

// GET home page.
router.get("/", function(req, res, next) {
  require("../hand").GET(res, "layout-view");
});

// GET all products.
router.get("/all", function(req, res, next) {
  require("../hand").GET(res, "data-view", () => db.products.view_all_product());
});

// Add products
// router.get("/insert", function(req, res, next) {
//   require("../hand").GET(res, "insert");
// });

module.exports = router;
