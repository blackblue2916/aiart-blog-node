const mysql = require("mysql");
const { MYSQL_CONF } = require("../conf/dbConf");
const con = mysql.createConnection(MYSQL_CONF);

con.connect(function (err) {
  if (err) {
    console.error("mysql connect error: " + err.stack);
    setTimeout(mysql.createConnection(MYSQL_CONF), 3000);
  }
  console.log("mysql connect as id: " + con.threadId);
});

// 数据库执行函数
async function exec(sql_query) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql_query, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      resolve(result);
    });
  });
  return promise;
}

module.exports = { con, exec, escape: mysql.escape };
