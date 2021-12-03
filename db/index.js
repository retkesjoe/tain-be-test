const mysqlClient = require("mysql");
const fs = require("fs");
const mysql = require("./config");

const path = __dirname+'\\dump\\seed.sql';


const seedQuery = fs.readFileSync(path, {
  encoding: "utf-8"
});

if (mysql.enable) {
    const connection = mysqlClient.createConnection(mysql);

    console.log("Running SQL seed...");

    connection.query(seedQuery, err => {
      if (err) {
        throw err;
      }

      console.log("SQL seed completed!");
      connection.end();
    })
}
