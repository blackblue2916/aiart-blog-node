const { exec, escape } = require("../db/mysql");

// 獲得所有風格類型
const getTypeList = async () => {
  let sql_query = `SELECT * FROM aiart_type WHERE 1=1 `;
  // 倒敘排列,最新的在前
  sql_query += `ORDER BY id DESC;`;
  return exec(sql_query);
};

const getAllClassKey = async (class_key) => {
  let sql_query = `SELECT * FROM aiart_data WHERE 1=1 `;
  sql_query += `AND class_key='${class_key}' `;
  sql_query += `ORDER BY id DESC;`;
  return exec(sql_query);
};

const getClassKeyLimit = async (startIndex, limit, class_key) => {
  let sql_query = `SELECT * FROM aiart_data WHERE 1=1 `;

  sql_query += `AND class_key='${class_key}' `;

  sql_query += `order by id desc `;

  sql_query += `LIMIT ${startIndex}, ${limit}; `;

  return exec(sql_query);
};

const getImageByClassKeyAndId = async (class_key, id) => {
  let sql_query = `SELECT * FROM aiart_data WHERE 1=1 `;
  sql_query += `AND class_key='${class_key}' AND id=${id}; `;
  return exec(sql_query);
};

module.exports = {
  getTypeList,
  getClassKeyLimit,
  getAllClassKey,
  getImageByClassKeyAndId,
};
