"use strict";

const mysqlClient = require("mysql");

const mysql = require("../config");
const Util = require("./util");

class Ado {

  constructor() {
    this.pool;
    if (mysql.enable) {
      this.pool = mysqlClient.createPool(mysql);
    }
  }

  format(sql, values) {
    return mysqlClient.format(sql, values);
  }

  query(sql, values, cb) {
    if (this.pool) {
      this.pool.getConnection( (connectionError, conn) => {
        if (connectionError) {
          connectionError.params = mysql;

          cb(null, null);

        } else {

          let query = conn.query(sql, values, (error, results, fields) => {
            conn.release();

            if (error) {
              cb(null, null);
            } else if (results.length == 0){
              cb(null, null); 
            } else {
              cb(results, fields);
            }

          });

          conn.on("error", (error) => {
            conn.release();
            cb(null, null);
          });
        }
      });
    } else {
      cb(null, null);
    }
  }

  queryAll(queries, values, cb) {
    this.query(queries.join("; "), values, cb);
  }

  getAll(sql, values, idx, cb) {
    if (idx.type && idx.name) {

      this.query(sql, values, function(results, fields) {

        let data = {};
        if (results && results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            let item = results[i];

            let newIdx = idx.type == "int" ? parseInt(item[idx.name]) : item[idx.name];
            if (idx.group) {

              if (!Util.isset(data, newIdx)) {
                if (idx.group.type != "zero") {
                  data[newIdx] = {};
                } else {
                  data[newIdx] = [];
                }
              }

              if (idx.group.type != "zero") {
                let groupIdx = idx.group.type == "int" ? parseInt(item[idx.group.name]) : item[idx.group.name];
                for (let p = 0; p < idx.group.parentfields.length; p++) {
                  const parentfield = idx.group.parentfields[p];
                  if (Util.isset(item, parentfield) && !Util.isset(data[newIdx], parentfield)) {
                    data[newIdx][parentfield] = item[parentfield];
                  }
                }
                if (!Util.isset(data[newIdx], idx.group.subitemname)) {
                  data[newIdx][idx.group.subitemname] = {};
                }
                data[newIdx][idx.group.subitemname][groupIdx] = item;
              } else {
                data[newIdx].push(item);
              }

            } else {
              data[newIdx] = item;
            }

          }
        }
        cb(data, fields);

      });

    } else {
      this.query(sql, values, cb);
    }
  }

  getRow(sql, values, cb) {
    sql = this.addLimitStringToQuery(sql);
    this.getAll(sql, values, {}, function (results, fields) {
      if (results && results.length == 1) {
        cb(results[0], fields);
        return;
      }
      cb(null, fields);
    });
  }

  getCol(sql, values, field, cb) {
    this.getAll(sql, values, {}, function (results) {
      let cols = [];
      if (results) {
        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          if (Util.isset(item, field)) {
            cols.push(item[field]);
          }
        }
      }
      if (cols.length > 0) {
        cb(cols);
      } else {
        cb(null);
      }
    });
  }

  getOne(sql, values, field, cb) {
    this.getRow(sql, values, function (result, fields) {
      if (Util.isset(result, field)) {
        cb(result[field], fields);
        return;
      }
      cb(null, fields);
    });
  }

  insert(table, record, cb) {
    let sql = `INSERT INTO \`${table}\` SET ?`;

    this.query(sql, record, function (results) {
      if (Util.isset(results, "insertId")) {
        cb(results.insertId);
      } else {
        cb(0);
      }
    });
  }

  insertAll(table, records, cb) {
    if (records.length > 0) {
      let fields = Object.keys(records[0]);
      let values = [];

      for (let r = 0; r < records.length; r++) {
        let row   = records[r];
        values[r] = [];

        for (let f = 0; f < fields.length; f++) {
          let field = fields[f];
          values[r][f] = row[field];
        }
      }

      fields = fields.join("`, `");

      let sql = `INSERT INTO \`${table}\` (\`${fields}\`) VALUES ?`;
      this.query(sql, [values], cb);
    } else {
      cb();
    }
  }

  update(table, record, idx, cb) {
    if (!idx || idx == "") {
      idx = "id";
    }

    let sql = `UPDATE \`${table}\` SET ? WHERE \`${idx}\` = ?`;
    this.query(sql, [record, record[idx]], cb);
  }

  updateAll(table, records, idx, cb) {
    if (!idx || idx == "") {
      idx = "id";
    }

    if (records.length > 0) {
      let sql     = "";
      let sets    = [];
      let values  = [];
      let queries = [];

      for (let i = 0; i < records.length; i++) {
        let record = records[i];
        sql += `UPDATE \`${table}\` SET `;

        let keys = Object.keys(record);
        for (let f = 0; f < keys.length; f++) {
          let field = keys[f];
          if (field != idx) {
            sets.push(`\`${field}\` = ?`);
            values.push(record[field]);
          }
        }

        sql += sets.join(", ");
        sql += ` WHERE \`${idx}\` = ?`;

        values.push(record[idx]);
        queries.push(this.format(sql, values));

        sql    = "";
        sets   = [];
        values = [];
      }

      if (queries.length > 0) {
        this.query(queries.join("; "), [], cb);
      } else {
        cb();
      }
    }
  }

  delete(table, id, idx, cb) {
    if (!idx || idx == "") {
      idx = "id";
    }

    let sql = `
      DELETE
      FROM \`${table}\`
      WHERE \`${idx}\` = ?`
    ;
    this.query(sql, [id], cb);
  }

  replace(table, record, cb) {
    let sql = `REPLACE INTO \`${table}\` SET ?`;

    this.query(sql, record, function (results) {
      if (Util.isset(results, "insertId")) {
        cb(results.insertId);
      } else {
        cb(0);
      }
    });
  }

  replaceAll(table, records, cb) {
    if (records.length > 0) {
      let fields = Object.keys(records[0]);
      let values = [];

      for (let r = 0; r < records.length; r++) {
        let row   = records[r];
        values[r] = [];

        for (let f = 0; f < fields.length; f++) {
          let field = fields[f];
          values[r][f] = row[field];
        }
      }

      fields = fields.join("`, `");

      let sql = `REPLACE INTO \`${table}\` (\`${fields}\`) VALUES ?`;
      this.query(sql, [values], cb);
    }
  }

  getNextAutoincrementByTable(tableName, cb) {
    this.getOne(`
      SELECT \`auto_increment\`
      FROM INFORMATION_SCHEMA.TABLES
      WHERE \`table_name\` = ?`,
    [tableName], "auto_increment", cb
    );
  }

  addLimitStringToQuery(sql){
    return sql + this.limitString( 1 );
  }

  limitString(limit, offset) {
    offset = Util.isset(offset) ? offset : 0;
    return ` LIMIT ${offset}, ${limit} `;
  }
}

module.exports = new Ado();
