const crypto = require("crypto");
// key
const SECRET_KEY = process.env.SECRET_KEY;
// md5
function md5(content) {
  let md5 = crypto.createHash("md5");
  return md5.update(content).digest("hex");
}
// 加密
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

function genConnKey() {
  const connKey = crypto.randomBytes(20).toString("hex");
  return connKey;
}

// 生成 CARD KEY
function genCardKey(length) {
  const cardKey = crypto.randomBytes(length).toString("hex");
  return cardKey;
}

module.exports = { genPassword, genConnKey, genCardKey };
