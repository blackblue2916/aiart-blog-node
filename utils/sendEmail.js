const nodemailer = require("nodemailer");
const mailGen = require("mailgen");
const { EMAIL, APP_PASSWORD } = require("../env");

// 測試 - 已經OK
async function testMail() {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let message = {
    from: "pixelMonkey <foo@example.com>",
    to: "baz@example.com",
    subject: "testing email",
    text: "hellow world",
    html: "<h1>Hellow World !</h1>",
  };

  transporter
    .sendMail(message)
    .then((info) => {
      console.log("emal send is done!", {
        msg: "this is testing email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((e) => {
      console.log("error : " + e);
    });
}

// 正式版 - 已經OK
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

module.exports = { sendMail };
