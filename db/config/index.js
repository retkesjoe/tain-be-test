require("dotenv").config();

const isProd = process.env.APP === 'prod';

const mysql = {
    "enable"   : isProd ? JSON.parse(process.env.PROD_MYSQL_ENABLE) : JSON.parse(process.env.MYSQL_ENABLE),
    "host"     : isProd ? process.env.PROD_MYSQL_HOST : process.env.MYSQL_HOST,
    "port"     : isProd ? parseInt(process.env.PROD_MYSQL_PORT) : parseInt(process.env.MYSQL_PORT),
    "user"     : isProd ? process.env.PROD_MYSQL_USERNAME : process.env.MYSQL_USERNAME,
    "password" : isProd ? process.env.PROD_MYSQL_PASSWORD : process.env.MYSQL_PASSWORD,
    "multipleStatements" : true,
    "connectionLimit"    : 1000,
    "connectTimeout"     : 60 * 60 * 1000,
    "aquireTimeout"      : 60 * 60 * 1000,
    "timeout"            : 60 * 60 * 1000,
    "debug"              : isProd ? JSON.parse(process.env.PROD_MYSQL_DEBUG) : JSON.parse(process.env.MYSQL_DEBUG),
    "log"                : isProd ? JSON.parse(process.env.PROD_MYSQL_LOG) : JSON.parse(process.env.MYSQL_LOG)
};

module.exports = mysql;
