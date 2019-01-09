"use strict";

const sql = require("../sql").products;
// const pgp = require("pg-promise")({
//   capSQL: false // if you want all generated SQL capitalized
// });

class ProductsRepository {
  constructor(db, pgp) {
    this.db = db;
    // this.pgp = pgp;
  }

  // Creates the table;
  // create() {
  //   return this.db.none(sql.create);
  // }

  // // Drops the table;
  // drop() {
  //   return this.db.none(sql.drop);
  // }

  // // Removes all records from the table;
  // empty() {
  //   return this.db.none(sql.empty);
  // }

  // Retreive admin table
  adminTables(query) {
    return this.db.multi(query);
  }

  // Retreive all tables
  allTablesDB() {
    return this.db.any(sql.allTablesDB);
  }

  // Retreive all tables for manage
  table_all_manage() {
    return this.db.any(sql.table_all_manage);
  }

  // Returns all product records;
  view_all_product() {
    return this.db.any(sql.view_all_product);
  }

  // Update row
  updateRow(data) {
    // console.log("DEBUG 1: ", data);
    return this.db.multi(sql.row_update, {
      data: JSON.stringify(data)
    });
  }

  // Delete row
  deleteRow(data) {
    console.log("(products.js) DEBUG 1: ", data);
    return this.db.multi(sql.row_delete, {
      data: JSON.stringify(data)
    });
  }

  // Insert row
  insertRow(data) {
    console.log("(products.js) DEBUG 1: ", data);
    return this.db.result(
      sql.row_insert,
      {
        data: JSON.stringify(data)
      },
      event => Object.values(event.rows[0])
    );
  }

  // Returns all grozde records;
  allGrozde() {
    return this.db.any(sql.allGrozde);
  }

  // Prepare add view
  addSelect() {
    return this.db.any(sql.addSelect);
  }

  // Adds a new record and returns the full object
  add(values) {
    return this.db.one(sql.add, {
      userId: +values.userId,
      productName: values.name
    });
  }

  // // Tries to delete a product by id, and returns the number of records deleted;
  // remove(id) {
  //   return this.db.result(
  //     "DELETE FROM products WHERE id = $1",
  //     +id,
  //     r => r.rowCount
  //   );
  // }

  // Tries to find a user product from user id + product name;
  // find(values) {
  //   return this.db.oneOrNone(sql.find, {
  //     userId: +values.userId,
  //     productName: values.name
  //   });
  // }

  // // Returns the total number of products;
  // total() {
  //   return this.db.one("SELECT count(*) FROM products", [], a => +a.count);
  // }
}

// Update string formatter
function updateFormatSQL(data) {
  let sql = "UPDATE " + data.table + " SET ";
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (key != "table" && key != "ID") {
        // const element = data[key];
        sql += key + "=";

        if (Number(data[key])) sql += data[key] + ", ";
        else sql += "'" + data[key] + "', ";
      }
    }
  }

  sql = sql.slice(0, -2);
  sql += " WHERE id=" + data.ID + ";";

  console.log("(products.js)", sql);
  return sql;
}

module.exports = ProductsRepository;
