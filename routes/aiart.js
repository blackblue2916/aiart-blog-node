const express = require("express");
const router = express.Router();
const {
  getUserByIdAndEmail,
  updateSilverCoin,
} = require("../controller/user.cont");
const {
  getTypeList,
  getAllClassKey,
  getImageByClassKeyAndId,
} = require("../controller/aiart.cont");
const { downloadFile } = require("../utils/main-functions");

const limit = 50;
const price = 5;
let typeResult = null;
let downlaoding = false;

router.get("/type", async function (req, res, next) {
  if (!typeResult) {
    typeResult = getTypeList();
  }
  if (typeResult) {
    return typeResult.then((listData) => {
      return res.render("aiart", {
        title:
          "像素猴子套圖寫真頁面 | AI ART | AI 畫廊 | AI 圖像技術 | 網站開發",
        data: listData,
        user: {
          id: res.userid,
          email: res.useremail,
          level: res.userlevel,
          conn_key: res.conn_key,
          login: res.login,
          title: res.title,
          apikey: "null",
        },
        focus: "aiart",
      });
    });
  }
});

router.get("/art-r18", async function (req, res, next) {
  if (res.useremail == "null" || res.login == "null" || res.userlevel <= 2) {
    return res.render("notify", {
      title: "像素猴子通知頁面 | AI ART | AI 畫廊 | AI 圖像技術 | 網絡開發",
      info: {
        email: res.useremail,
        message: "很抱歉!本區域只對白銀會員(年)及以上開放,不如嘗試一下?",
        messageEn:
          "This area is only open to silver members and above, why not give it a try?",
      },
    });
  }
  return res.render("art-r18", {
    title: "像素猴子套圖寫真頁面 | AI ART | AI 畫廊 | AI 圖像技術 | 網絡開發",
    user: {
      id: res.userid,
      email: res.useremail,
      level: res.userlevel,
      conn_key: res.conn_key,
      loing: res.login,
      title: res.title,
      apikey: "",
    },
    focus: "null",
  });
});

router.get("/class_key", async (req, res, next) => {
  let class_key = req.query.class_key;
  const classKeyResult = getAllClassKey(class_key);
  if (classKeyResult) {
    classKeyResult.then((listData) => {
      if (listData.length > 0) {
        return res.render("aiart_class", {
          title:
            "像素猴子套圖寫真頁面 | AI ART | AI 畫廊 | AI 圖像技術 | 網站開發",
          data: listData,
          class_key: class_key.toUpperCase(),
          user: {
            id: res.userid,
            email: res.useremail,
            level: res.userlevel,
            conn_key: res.conn_key,
            loing: res.login,
            title: res.title,
            apikey: "",
          },
          focus: "null",
        });
      } else {
        return res.redirect("/error");
      }
    });
  }
  // if (classKeyResult) {
  //   return classKeyResult.then((listData) => {
  //     // 縂條目
  //     const resultCount = listData.length;
  //     if (resultCount > 0) {
  //       // 縂頁數
  //       const pages = Math.ceil(resultCount / limit);
  //       // 當前請求頁
  //       let page = req.query.page ? Number(req.query.page) : 1;
  //       if (page > pages) {
  //         page = pages - 1;
  //       } else if (page < 1) {
  //         page = 1;
  //       }
  //       // 當前頁起始數
  //       let startIndex = (page - 1) * limit;
  //       // 獲取當前頁所有條目
  //       const limitResult = getClassKeyLimit(
  //         startIndex < 0 ? 0 : startIndex,
  //         limit,
  //         class_key
  //       );
  //       if (limitResult) {
  //         return limitResult.then((limitData) => {
  //           let iterator = page - 5 < 1 ? 1 : page - 5;
  //           let endingLink =
  //             iterator + 5 <= pages ? iterator + 5 : page + (pages - page);
  //           if (endingLink < page + 4) {
  //             iterator -= page + 4 - pages;
  //           }
  //           return res.render("aiart-class", {
  //             title: "像素猴子套圖寫真頁面 | AI ART | AI 畫廊 | AI 圖像技術",
  //             data: limitData,
  //             page: page,
  //             iterator: iterator,
  //             endingLink: endingLink,
  //             pages: pages,
  //             resultCount: resultCount,
  //             user: {
  //               id: res.userid,
  //               email: res.useremail,
  //               level: res.userlevel,
  //               conn_key: res.conn_key,
  //               loing: res.login,
  //               title: res.title,
  //               apikey: "",
  //             },
  //             focus: "aiart",
  //           });
  //         });
  //       }
  //     }
  //   });
  // }
  // return res.redirect("/error");
});

router.get("/org_img_down", async (req, res, next) => {
  let { class_key, id } = req.query;
  if (downlaoding) {
    return res.render("notify", {
      title: "像素猴子通知頁面 | AI ART | AI 畫廊 | AI 圖像技術 | 網站開發",
      info: {
        email: res.useremail,
        message:
          "服務器繁忙,正在處理用戶下載隊列任務,請稍後幾秒鐘后再次嘗試下載!",
        messageEn:
          "The server is busy, processing user download queue tasks, please try to download again in a few seconds!",
      },
    });
  }
  if (res.useremail == "null" || res.login == "null") {
    return res.render("notify", {
      title: "像素猴子通知頁面 | AI ART | AI 畫廊 | AI 圖像技術 | 網站開發",
      info: {
        email: res.useremail,
        message:
          "您好: 未注冊用戶,您需要注冊,或登錄一個賬號,如果沒有請注冊一個吧!",
        messageEn:
          "You need to log in to an account, if not, please register one!",
      },
    });
  } else {
    let user = getUserByIdAndEmail(res.userid, res.useremail);
    user.then((userdata) => {
      if (userdata) {
        // return res.status(201).json(data[0]);
        let silver_coin = userdata[0].silver_coin;
        let vip_level = userdata[0].vip_level;
        let email = userdata[0].email;
        let image = getImageByClassKeyAndId(class_key, Number(id));
        image.then((imagedata) => {
          if (imagedata) {
            downlaoding = true;
            if (Number(vip_level > 2)) {
              return res.render("show-image", {
                title:
                  "像素猴子圖片展示頁面 | AI ART | AI 畫廊 | AI 圖像技術 | 網站開發",
                message: "",
                image_url: imagedata[0].org_img,
              });
            } else if (Number(silver_coin) >= price && Number(vip_level) <= 2) {
              let new_silver_coin = Number(silver_coin) - price;
              let result = updateSilverCoin(
                Number(res.userid),
                email,
                new_silver_coin
              );
              if (result) {
                result.then((updateCompleted) => {
                  if (updateCompleted) {
                    downloadFile(imagedata[0].org_img, function (fileName) {
                      // console.log("download file: " + fileName);
                      downlaoding = true;
                      return res.send({
                        file: fileName,
                        message: "您的請求已經完成,正在下載中...",
                      });
                    });
                    // return res.render("show-image", {
                    //   title:
                    //     "像素猴子圖片展示頁面 | AI ART | AI 畫廊 | AI 圖像技術",
                    //   message: "本次下載扣除5銀幣!",
                    //   image_url: imagedata[0].org_img,
                    // });
                  }
                });
              }
            }
          }
        });
      }
    });
  }
});

module.exports = router;
