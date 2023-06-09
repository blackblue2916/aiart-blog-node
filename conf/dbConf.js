const env = process.env.NODE_ENV;
let MYSQL_CONF;
let REDIS_CONF;

if (env === "development") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: null,
    port: "3306",
    database: "bjloveyou_com",
  };

  REDIS_CONF = {
    port: 6379,
    host: "127.0.0.1",
    legacyMode: true,
  };
}

if (env === "production") {
  MYSQL_CONF = {
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    port: process.env.MARIADB_PORT,
    database: process.env.MARIADB_DB_NAME,
  };

  REDIS_CONF = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    legacyMode: true,
  };
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
