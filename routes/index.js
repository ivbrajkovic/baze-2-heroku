"use strict";

const db = require("../db");
const router = require("express").Router();

// GET home page
router.get("/", function(req, res, next) {
  require("../hand").GET(res, "layout-view");
});

// GET all products
router.get("/all", function(req, res, next) {
  require("../hand").GET(
    res,
    "data-view",
    () => db.products.view_all_product(),
    {
      view_name: "Svi proizvodi"
    }
  );
});

// GET skladiste
router.get("/skladiste", function(req, res, next) {
  require("../hand").GET(res, "data-view", () => db.products.view_skladiste(), {
    view_name: "Skladiste"
  });
});

// GET maloprodaja
router.get("/maloprodaja", function(req, res, next) {
  require("../hand").GET(
    res,
    "data-view",
    () => db.products.view_maloprodaja(),
    {
      view_name: "Maloprodaja"
    }
  );
});

// GET veleprodaja
router.get("/veleprodaja", function(req, res, next) {
  require("../hand").GET(
    res,
    "data-view",
    () => db.products.view_veleprodaja(),
    {
      view_name: "Veleprodaja"
    }
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
