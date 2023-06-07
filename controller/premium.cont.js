const { exec, escape } = require("../db/mysql");

const getProducts = async () => {
  let sql_query = `SELECT * FROM products WHERE 1=1 `;
  return exec(sql_query);
};

const getProductById = async (id) => {
  let sql_query = `SELECT * FROM products WHERE 1=1 `;
  id = Number(id);
  sql_query += `AND id=${id};`;
  return exec(sql_query);
};

const checkEmialAndConnKey = async (email, conn_key) => {
  email = escape(email);
  conn_key = escape(conn_key);
  let sql_query = `SELECT * FROM user_account WHERE 1=1 `;
  sql_query += `AND email=${email} AND conn_key=${conn_key}; `;
  return exec(sql_query);
};

const sellCardKey = async (tablename) => {
  let sql_query = `SELECT * FROM ${tablename} WHERE 1=1 `;
  sql_query += `AND inuse='no' AND sell='no'; `;
  return await exec(sql_query).then((rows) => {
    return rows[0] || null;
  });
};

const verifyCardKey = async (tablename, card_key) => {
  let sql_query = `SELECT * FROM ${tablename} WHERE 1=1 `;
  sql_query += `AND card_key='${card_key}' AND inuse='no' AND sell='yes'; `;
  return await exec(sql_query).then((rows) => {
    return rows[0] || null;
  });
};

const addOrder = async (user_id, product_description, card_key, invoice) => {
  let sql_query = `INSERT INTO order_data (user_id,product_description,card_key,invoice,create_at) VALUES (${user_id},'${product_description}','${card_key}','${invoice}','${Date.now()}'); `;
  return await exec(sql_query).then((rows) => {
    return rows[0] || null;
  });
};

const getOrderList = async (user_id) => {
  let sql_query = `SELECT * FROM order_data WHERE 1=1 `;
  sql_query += `AND user_id=${user_id}; `;
  return await exec(sql_query).then((rows) => {
    return rows || null;
  });
};

const updateSellCardKey = async (tablename, card_key) => {
  let sql_query = `UPDATE ${tablename} SET sell='yes' WHERE 1=1 `;
  sql_query += `AND card_key='${card_key}' AND inuse='no' AND sell='no'; `;
  return await exec(sql_query).then((updateData) => {
    if (updateData.affectedRows > 0) {
      // console.log(updateData);
      return true;
    }
    return false;
  });
};

const updateUseCardKey = async (tablename, card_key) => {
  let sql_query = `UPDATE ${tablename} SET inuse='yes' WHERE 1=1 `;
  sql_query += `AND card_key='${card_key}' AND inuse='no' AND sell='yes'; `;
  return await exec(sql_query).then((updateData) => {
    if (updateData.affectedRows > 0) {
      // console.log(updateData);
      return true;
    }
    return false;
  });
};

module.exports = {
  getProducts,
  getProductById,
  checkEmialAndConnKey,
  verifyCardKey,
  updateUseCardKey,
  updateSellCardKey,
  addOrder,
  sellCardKey,
  getOrderList,
};
