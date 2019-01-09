"use strict";

// File sql.js

// Proper way to organize an sql provider:
//
// - have all sql files for Users in ./sql/users
// - have all sql files for Products in ./sql/products
// - have your sql provider module as ./sql/index.js

const QueryFile = require("pg-promise").QueryFile;
const path = require("path");

// Helper for linking to external query files:
function sql(file) {
  // generating full path
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, { minify: true });
}

module.exports = {
  // external queries for Products:
  products: {
    allTablesDB: sql("products/all-tables-db.sql"),
    view_all_product: sql("products/view-all-product.sql"),
    // allGrozde: sql("products/allGrozde.sql"),
    // addSelect: sql("products/addSelect.sql"),
    table_all_manage: sql("products/table-all-manage.sql"),
    row_delete: sql("products/row-delete.sql"),
    row_update: sql("products/row-update.sql"),
    row_insert: sql("products/row-insert.sql")
  }
};
