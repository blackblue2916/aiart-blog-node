const { exec, escape } = require("../db/mysql");

// 獲得所有頁
const getPostsList = async () => {
  let sql_query = `SELECT * FROM aiblog_posts WHERE 1=1 `;
  // 倒敘排列,最新的在前
  sql_query += `ORDER BY id DESC;`;
  return exec(sql_query);
};

const getPostsLimit = async (startIndex, limit) => {
  let sql_query = `SELECT * FROM aiblog_posts WHERE 1=1 `;

  sql_query += `order by id desc `;

  sql_query += `LIMIT ${startIndex}, ${limit}; `;

  return exec(sql_query);
};

const getPostById = async (id) => {
  let sql_query = `SELECT * FROM aiblog_posts WHERE 1=1 `;
  sql_query += `AND id=${id}; `;
  return exec(sql_query);
};

module.exports = { getPostsList, getPostsLimit, getPostById };
