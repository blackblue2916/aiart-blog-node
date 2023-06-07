const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const { sendMail } = require("../utils/main-functions");
const {
  getProducts,
  getProductById,
  checkEmialAndConnKey,
  verifyCardKey,
  updateUseCardKey,
  updateSellCardKey,
  addOrder,
  sellCardKey,
  getOrderList,
} = require("../controller/premium.cont");
const {
  getUserByIdAndEmail,
  updateUserInfo,
} = require("../controller/user.cont");
const { cardTypeAndData } = require("../utils/getTableType");

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const environment = process.env.PAYPAL_ENVIRONMENT || "sandbox";
const paypal_url = {
  sandbox: "https://api-m.sandbox.paypal.com",
  production: "https://api-m.paypal.com",
};

// 充值產品首頁
router.get("/product", (req, res, next) => {
  const result = getProducts();
  if (result) {
    result.then((listData) => {
      if (listData.length > 0) {
        return res.render("premium", {
          title: "像素猴子贊助頁面 | AI ART | AI 畫廊 | AI 圖像技術",
          data: listData,
          user: {
            id: res.userid,
            email: res.useremail,
            level: res.userlevel,
            conn_key: res.conn_key,
            login: res.login,
            title: res.title,
            apikey: "",
          },
          focus: "premium",
        });
      }
    });
  }
});

// 用户页面
router.get("/vip", (req, res, next) => {
  if (res.login == "null") {
    return res.render("vip", {
      title: "像素猴子個人頁面 | AI ART | AI 畫廊 | AI 圖像技術",
      message: "您需要登錄才可以使用充值以及其他功能!",
      messageEn: "You need to log in to use recharge and other functions!",
      user: {
        id: res.userid,
        email: res.useremail,
        level: res.userlevel,
        conn_key: res.conn_key,
        silver_coin: 0,
        login: res.login,
        title: res.title,
        apikey: "",
      },
      focus: "vip",
    });
  } else {
    let user = getUserByIdAndEmail(Number(res.userid), res.useremail);

    user.then((data) => {
      if (data) {
        let userOrder = getOrderList(Number(res.userid));
        userOrder.then((orders) => {
          if (orders) {
            return res.render("vip", {
              title: "像素猴子個人頁面 | AI ART | AI 畫廊 | AI 圖像技術",
              message: "",
              messageEn: "",
              orders: orders,
              user: {
                id: res.userid,
                premium: data[0].title,
                email: res.useremail,
                level: res.userlevel,
                conn_key: res.conn_key,
                silver_coin: data[0].silver_coin,
                login: res.login,
                title: res.title,
                apikey: "",
              },
              focus: "vip",
            });
          }
        });
      }
    });
  }
});

// 会员卡密充值
router.post("/add-card-key", async (req, res, next) => {
  const body = await req.body;
  // 獲得數據庫名稱
  const tableData = cardTypeAndData(body.card_key);
  if (tableData) {
    // 鏈接卡密數據庫,查找并更新
    const result = verifyCardKey(tableData.table, body.card_key);
    result.then((verifydata) => {
      if (verifydata) {
        const updateResult = updateUseCardKey(tableData.table, body.card_key);
        updateResult.then((updateCompleted) => {
          if (updateCompleted) {
            const user = getUserByIdAndEmail(Number(res.userid), res.useremail);
            user.then((data) => {
              if (data) {
                let silver_coin =
                  Number(data[0].silver_coin) + Number(tableData.silver_coin);

                let expiration =
                  Number(data[0].expiration) + Number(tableData.expiration);

                const updateUserResult = updateUserInfo(
                  Number(res.userid),
                  res.useremail,
                  Number(tableData.vip_level),
                  tableData.noble_name,
                  silver_coin,
                  expiration
                );
                updateUserResult.then((userUpdateCompleted) => {
                  if (userUpdateCompleted) {
                    return res.status(201).json({
                      messageCN: "會員升級成功,請移步或刷新會員頁面查看詳細!",
                      messageEN:
                        "The membership upgrade is successful, please move or refresh the membership page to view details!",
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        return res.status(501).send({
          messageCN: "該卡密不存在或已經使用!",
          messageEN: "The password does not exist or has been used!",
        });
      }
    });
  }
});

// 用户登錄验证 - 決定棄用
// router.get("/check-user-key", async (req, res, next) => {
//   // 當用戶多次通過正常通道跳轉到該頁充值, 清除 session, 重新建立
//   req.session.destroy();

//   const { conn_key, from } = req.query;

//   if (conn_key && from) {
//     return res.render("check-user-key", {
//       title: "驗證用戶權限",
//       from: from,
//       conn_key: conn_key,
//     });
//   }

//   return res.redirect("/premium/product");
// });

// 驗證用戶信息 - 決定棄用
// router.post("/check-user-key", async (req, res, next) => {
//   // 遠程服務器將發送一個鏈接key, 使用哈希MD5加密, 本地使用該 key 到數據庫驗證是否存在, 如果存在將建立會話,保持登錄
//   const { conn_key, email } = req.body;
//   const result = checkEmialAndConnKey(email, conn_key);

//   if (result) {
//     return result.then((listData) => {
//       if (listData.length > 0) {
//         // 驗證成功, 設置會話
//         req.session.useremail = listData[0].email;
//         setTimeout(() => {
//           return res.redirect("/premium/product");
//         }, 1000);
//       } else {
//         // return res.status(500).json("error: 驗證失敗!");
//         return res.redirect("/error");
//       }
//     });
//   } else {
//     return res.redirect("/error");
//   }
// });

// 支付頁面
router.get("/paypal-payment-page", (req, res, next) => {
  const id = req.query.id;
  // console.log(res.useremail);

  if (id && res.useremail != "null") {
    const result = getProductById(id);
    if (result) {
      result.then((data) => {
        if (data) {
          return res.render("payment", {
            title: "Paypal - 支付頁面",
            clientId: PAYPAL_CLIENT_ID,
            // clientSecret: PAYPAL_CLIENT_SECRET,
            currency: "USD",
            user: {
              id: res.userid,
              email: res.useremail,
              level: res.userlevel,
              conn_key: res.conn_key,
              login: res.login,
              title: res.title,
              apikey: "",
            },
            focus: "null",
            product: data[0],
            invoice: "Invoice-" + String(Date.now()),
            warning: null,
          });
        }
      });
    }
  } else {
    return res.render("payment", {
      title: "Paypal - 支付頁面",
      clientId: null,
      user: {
        id: res.userid,
        email: res.useremail,
        level: res.userlevel,
        conn_key: res.conn_key,
        login: req.session.useremail ? true : false,
      },
      focus: "null",
      product: {
        price: -1,
        amount: -1,
      },
      invoice: "na",
      useremail: "na",
      warning: "該產品不存在,或者您沒有登錄賬號!",
    });
  }
});

// get token -
// function get_access_token() {
//   const auth = `${clientId}:${clientSecret}`;
//   const data = "grant_type=client_credentials";
//   return fetch(paypal_url + "/v1/oauth2/token", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization: `Basic ${Buffer.from(auth).toString("base64")}`,
//     },
//     body: data,
//   })
//     .then((res) => res.json())
//     .then((json) => {
//       return json.access_token;
//     });
// }

// 前端调用 - 创建支付命令
// router.post("/create-paypal-order", async (req, res) => {
//   const price = await req.body.cart.price;
//   const currency = await req.body.currency;
//   get_access_token()
//     .then((access_token) => {
//       let order_data_json = {
//         intent: req.body.intent.toUpperCase(),
//         purchase_units: [
//           {
//             amount: {
//               currency_code: currency,
//               value: price,
//             },
//           },
//         ],
//       };
//       const data = JSON.stringify(order_data_json);

//       fetch(paypal_url + "/v2/checkout/orders", {
//         //https://developer.paypal.com/docs/api/orders/v2/#orders_create
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access_token}`,
//         },
//         body: data,
//       })
//         .then((res) => res.json())
//         .then((json) => {
//           res.send(json);
//         }); //Send minimal data to client
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// });

// 前端调用 - 完成订单
// router.post("/complete-paypal-order", (req, res) => {
//   get_access_token()
//     .then((access_token) => {
//       fetch(
//         paypal_url +
//           "/v2/checkout/orders/" +
//           req.body.order_id +
//           "/" +
//           req.body.intent,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${access_token}`,
//           },
//         }
//       )
//         .then((res) => res.json())
//         .then((json) => {
//           console.log(json);
//           res.send(json);
//         }); //Send minimal data to client
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// });

// 前端調用 - 創建支付命令
router.post("/create-paypal-order", async (req, res, next) => {
  const price = await req.body.product.price;
  const order = await createOrder(price);
  res.json(order);
});

// use the orders api to create an order
async function createOrder(price) {
  const accessToken = await generateAccessToken();
  const url = `${paypal_url.sandbox}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price,
          },
        },
      ],
    }),
  });
  const data = await response.json();
  return data;
}

// 前端捕獲交易命令后, 完成交易
router.post("/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  const captureData = await capturePayment(orderID);
  // TODO: store payment information such as the transaction ID
  res.json(captureData);
});

// use the orders api to capture payment for an order
async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${paypal_url.sandbox}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data;
}

// generate an access token using client id and app secret
async function generateAccessToken() {
  const auth = Buffer.from(
    PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
  ).toString("base64");
  const response = await fetch(`${paypal_url.sandbox}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}

// 存储完成的订单到数据库,发送邮件,发送产品密钥到用户后台
router.post("/payment-successful", async (req, res, next) => {
  if (res.useremail != "null" && res.login != "null") {
    const body = await req.body;
    const email = res.useremail;
    const tableName = body.tableName;
    const description = body.description;
    const invoice = body.invoice;
    const price = body.price;
    // 獲得出售的卡密
    const cardResult = sellCardKey(tableName);
    cardResult.then((data) => {
      if (data) {
        const card_key = data.card_key;
        // 更新已經出售的卡密
        const updateResult = updateSellCardKey(tableName, card_key);
        updateResult.then((data) => {
          if (data) {
            // 將出售的卡密添加到玩家購物列表
            console.log("update: " + data);
            const orderResult = addOrder(
              Number(res.userid),
              description,
              card_key,
              invoice
            );

            orderResult.then(async (orderdata) => {
              await sendMail(email, description, card_key, price);
              if (orderdata) {
                console.log("order: " + orderdata);
                return res.json({
                  message: "payment successful!",
                  done: true,
                });
              }
            });
          }
        });
      }
    });
  }
  return res.json({
    message: "error",
    done: false,
  });
});

module.exports = router;
