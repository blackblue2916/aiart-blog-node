const { exec, escape } = require("../db/mysql");
const { genPassword, genConnKey: genConnKey } = require("../utils/cryp");

const login = async (email, password) => {
  password = genPassword(password);
  // console.log(password);
  email = escape(email);
  password = escape(password);
  let sql_query = `SELECT * FROM user_account WHERE 1=1 `;
  sql_query += `AND email=${email} AND password=${password};`;
  return await exec(sql_query).then((rows) => {
    return rows[0] || {};
  });
};

const register = async (email, password) => {
  password = genPassword(password);
  email = escape(email);
  password = escape(password);
  const connKey = genConnKey();
  let sql_query = `INSERT INTO user_account (email,conn_key,password,title,vip_level,silver_coin,create_at,expiration) VALUES (${email},'${connKey}',${password},'初心者',${1},${50},'${Date.now()}','${Date.now()}'); `;
  return await exec(sql_query).then((rows) => {
    return rows[0] || {};
  });
};

const getUserByIdAndConnKey = (id, conn_key) => {
  let sql_query = `SELECT * FROM user_account WHERE 1=1 `;
  sql_query += `AND id=${id} `;
  sql_query += `AND conn_key='${conn_key}'; `;
  return exec(sql_query);
};

const getUserByIdAndEmail = (id, email) => {
  email = escape(email);
  let sql_query = `SELECT * FROM user_account WHERE 1=1 `;
  sql_query += `AND id=${id} AND email=${email}; `;
  return exec(sql_query);
};

const updateUserInfo = async (
  id,
  email,
  vip_level,
  noble_name,
  silver_coin,
  expiration
) => {
  email = escape(email);
  let sql_query = `UPDATE user_account SET title='${noble_name}',vip_level=${Number(
    vip_level
  )},silver_coin=${Number(silver_coin)},expiration='${expiration}' WHERE 1=1 `;
  sql_query += `AND id=${id} AND email=${email}; `;
  return await exec(sql_query).then((updateData) => {
    if (updateData.affectedRows > 0) {
      // console.log(updateData);
      return true;
    }
    return false;
  });
};

const updateConnKey = async (id) => {
  const connKey = genConnKey();
  let sql_query = `UPDATE user_account SET conn_key='${connKey}' WHERE 1=1 `;
  // console.log(sql_query);
  sql_query += `AND id=${id}; `;
  return await exec(sql_query).then((updateData) => {
    if (updateData.affectedRows > 0) {
      // console.log(updateData);
      return true;
    }
    return false;
  });
};

const updateSilverCoin = async (id, email, new_silver_coin) => {
  email = escape(email);
  let sql_query = `UPDATE user_account SET silver_coin=${Number(
    new_silver_coin
  )} WHERE 1=1 `;
  sql_query += `AND id=${id} AND email=${email}; `;
  return await exec(sql_query).then((updateData) => {
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

const checkEmail = async (email) => {
  email = escape(email);
  let sql_query = `SELECT * FROM user_account WHERE 1=1 `;
  sql_query += `AND email=${email};`;
  return await exec(sql_query).then((rows) => {
    return rows[0] || {};
  });
};

module.exports = {
  getUserByIdAndConnKey,
  getUserByIdAndEmail,
  login,
  register,
  updateConnKey,
  checkEmail,
  updateSilverCoin,
  updateUserInfo,
};

// UPDATE `user_account` SET `id`='[value-1]',`email`='[value-2]',`conn_key`='[value-3]',`password`='[value-4]',`title`='[value-5]',`vip_level`='[value-6]',`silver_coin`='[value-7]',`create_at`='[value-8]',`expiration`='[value-9]' WHERE 1
