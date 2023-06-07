const { exec, escape } = require("../db/mysql");

// 首頁最新貼文
const getLatestPostsLimit = async (limit) => {
  let sql_query = `SELECT * FROM aiblog_posts WHERE 1=1 `;

  sql_query += `ORDER BY id DESC `;

  sql_query += `LIMIT ${limit}; `;

  return exec(sql_query);
};

// 獲得分割頁
const getLimitList = async (startIndex, limit) => {
  let sql_query = `SELECT * FROM aiblog_posts WHERE 1=1 `;

  sql_query += `order by id desc `;

  sql_query += `LIMIT ${startIndex}, ${limit}; `;

  return exec(sql_query);
};

// 獲得所有頁
const getList = async () => {
  let sql_query = `SELECT * FROM aiblog_postsWHERE 1=1 `;
  // 倒敘排列,最新的在前
  sql_query += `ORDER BY id DESC;`;
  return exec(sql_query);
};

module.exports = { getLatestPostsLimit };
