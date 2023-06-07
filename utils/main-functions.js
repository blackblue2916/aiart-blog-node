const nodemailer = require("nodemailer");
const mailGen = require("mailgen");
const fs = require("fs");
const https = require("https");
const path = require("path");
const { EMAIL, APP_PASSWORD } = require("../env");

// 產品類型已經產品明細
function cardTypeAndData(card_key) {
  let length = Number(card_key.length);
  let data = {};
  switch (length) {
    case 12:
      data = {
        table: "coin_2000",
        vip_level: 1,
        silver_coin: 2000,
        noble_name: "初心者",
        expiration: 0,
      };
      break;

    case 14:
      data = {
        table: "coin_5000",
        vip_level: 1,
        silver_coin: 5000,
        noble_name: "初心者",
        expiration: 0,
      };
      break;

    case 16:
      data = {
        table: "silver_7",
        vip_level: 2,
        silver_coin: 300,
        noble_name: "白銀會員",
        expiration: 7 * 24 * 60 * 60 * 1000,
      };
      break;

    case 18:
      data = {
        table: "silver_180",
        vip_level: 2,
        silver_coin: 800,
        noble_name: "白銀會員",
        expiration: 180 * 24 * 60 * 60 * 1000,
      };
      break;

    case 20:
      data = {
        table: "silver_360",
        vip_level: 3,
        silver_coin: 1600,
        noble_name: "白銀會員",
        expiration: 360 * 24 * 60 * 60 * 1000,
      };
      break;

    case 22:
      data = {
        table: "gold_180",
        vip_level: 5,
        silver_coin: 3000,
        noble_name: "黃金會員",
        expiration: 180 * 24 * 60 * 60 * 1000,
      };
      break;

    case 24:
      data = {
        table: "gold_360",
        vip_level: 8,
        silver_coin: 6000,
        noble_name: "黃金會員",
        expiration: 360 * 24 * 60 * 60 * 1000,
      };
      break;

    case 26:
      data = {
        table: "gold_forever",
        vip_level: 99,
        silver_coin: 50000,
        noble_name: "黃金會員",
        expiration: 3600 * 24 * 60 * 60 * 1000,
      };
      break;

    default:
      data = null;
      break;
  }
  return data;
}

// 通過卡表格獲得卡號長度,用於卡號生成
function genCardLength(cardTableName) {
  let keyLength = 0;
  switch (cardTableName) {
    case "coin_2000":
      keyLength = 6; // 12
      break;

    case "coin_5000":
      keyLength = 7; // 14
      break;

    case "silver_7":
      keyLength = 8; // 16
      break;

    case "silver_180":
      keyLength = 9; // 18
      break;

    case "silver_360":
      keyLength = 10; // 20
      break;

    case "gold_180":
      keyLength = 11; // 22
      break;

    case "gold_360":
      keyLength = 12; // 24
      break;

    case "gold_forever":
      keyLength = 13; // 26
      break;

    default:
      keyLength = 0;
      break;
  }

  return keyLength;
}

// 獲得隨機數
function getRandomNumber() {
  return Math.round(Math.random() * (50000 - 1000)) + 500;
}

// 發送郵件
async function sendMail(user_email, item, card_key, price) {
  let data = {
    email: user_email,
    item: item,
    card_key: card_key,
    price: price,
  };
  console.log(data);
  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: APP_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new mailGen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      name: user_email,
      intro: "您的賬單已經發送,請核對機密訊息!",
      table: {
        data: [
          {
            item: item,
            description: "請在48小時内在指定的網站輸入卡密進行充值",
            card_key: card_key,
            price: price,
          },
        ],
      },
      outro: "非常感謝您的購買,期待與您的下一次聯係!",
    },
  };

  let mail = await MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: user_email,
    subject: "訂單",
    html: mail,
  };

  return await transporter
    .sendMail(message)
    .then((info) => {
      console.log("您應該會收到一封郵件,包含購買和卡密訊息!");
      return true;
    })
    .catch((err) => {
      console.log("郵件發送失敗: " + err);
      return false;
    });
}
async function downloadFile(url, callback) {
  const fileName = path.basename(url);
  const exists = fs.existsSync("./resource/" + fileName);
  if (exists) {
    callback(fileName);
  } else {
    const result = https.get(url, function (res) {
      const fileStream = fs.createWriteStream("./resource/" + fileName);
      res.pipe(fileStream);

      fileStream.on("error", function (err) {
        console.log(err);
      });

      fileStream.on("close", function () {
        callback(fileName);
      });

      fileStream.on("finish", function () {
        fileStream.close();
      });
    });
  }
}

module.exports = {
  cardTypeAndData,
  genCardLength,
  getRandomNumber,
  sendMail,
  downloadFile,
};
