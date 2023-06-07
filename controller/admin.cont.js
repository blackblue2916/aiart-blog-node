const { exec, escape } = require("../db/mysql");
const { getRandomNumber } = require("../utils/main-functions");

const createBlogPost = async (title, type, level, link) => {
  let sql_query = `INSERT INTO aiblog_posts (title,type,level,post_link) VALUES ('${title}','${type}',${level},'${link}'); `;
  return await exec(sql_query).then((rows) => {
    // console.log(rows);
    return rows[0] || {};
  });
};

const createAiArtType = async (classKey, title, preImageName) => {
  let sql_query = `INSERT INTO aiart_type (class_key,title,pre_img) VALUES ('${classKey}','${title}','${preImageName}'); `;

  return await exec(sql_query).then((rows) => {
    // console.log(rows);
    return rows[0] || {};
  });
};

const createAiArtImage = async (class_key, watch_level, pre_img, org_img) => {
  let sql_query = `INSERT INTO aiart_data (class_key,watch_level,pre_img,org_img) VALUES ('${class_key}',${watch_level},'${pre_img}','${org_img}'); `;
  return await exec(sql_query).then((rows) => {
    return rows[0] || {};
  });
};

const createCardKey = async (table, card_key) => {
  let sql_query = `INSERT INTO ${table} (card_key,inuse) VALUES ('${card_key}','no'); `;
  return await exec(sql_query).then((rows) => {
    return rows[0] || null;
  });
};

const refreshCardKey = async (table, card_key, id) => {
  let sql_query = `UPDATE ${table} SET card_key='${card_key}',inuse='no',sell='no' WHERE 1=1 `;
  sql_query += `AND inuse='yes' AND sell='yes' AND id=${id}; `;
  return await exec(sql_query).then((updateData) => {
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

const loging = async (email, password) => {
  email = escape(email);
  password = escape(password);
  let sql_query = `SELECT * FROM admin WHERE 1=1 `;
  sql_query += `AND email=${email} AND password=${password};`;
  return await exec(sql_query).then((rows) => {
    return rows[0] || {};
  });
};

module.exports = {
  createBlogPost,
  createAiArtImage,
  createAiArtType,
  loging,
  createCardKey,
  refreshCardKey,
};
