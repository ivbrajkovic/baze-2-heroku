"use strict";

const db = require("../db");
const router = require("express").Router();

// GET home page
router.get("/", function(req, res, next) {
  require("../hand").GET(res, "layout-view");
});

// GET all products
router.get("/all", function(req, res, next) {
  require("../hand").GET(res, "data-view", () =>
    db.products.view_all_product()
  );
});

// GET about
router.get("/about", function(req, res, next) {
  require("../hand").GET(res, "about-view");
});

// GET contact form
router.get("/contact", function(req, res, next) {
  require("../hand").GET(res, "contact-view");
});

module.exports = router;
