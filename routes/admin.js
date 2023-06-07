const express = require("express");
const router = express.Router();
const { checkAdminLogin } = require("../middleware/app.middleware");
const multer = require("multer");
const {
  createBlogPost,
  createAiArtImage,
  createAiArtType,
  loging,
  createCardKey,
  refreshCardKey,
} = require("../controller/admin.cont");
const { genCardKey } = require("../utils/cryp");
const { genCardLength } = require("../utils/getTableType");

router.get(
  "/bjloveyou-admin-page",
  // 在生产环境中,必须验证超级管理员身份
  // checkAdminLogin(),
  async (req, res, next) => {
    const focus = req.query.focus;
    const cardTable = req.query.cardTable;
    const refreshCardTable = req.query.refreshCardTable;
    const focusType = focus || "add-image";
    const cardTableName = cardTable || "coin_2000";
    const refreshCardTableName = refreshCardTable || "coin_2000";
    console.log("focus = ", focusType);
    return res.render("admin", {
      admin: req.session.admin,
      title: "像素猴子管理員頁面 | AI ART | AI 畫廊 | AI 圖像技術",
      focus: focusType,
      cardTableName: cardTableName,
      refreshCardTableName: refreshCardTableName,
    });
  }
);

// 類型庫預覽图片 ----------------
const typeStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images/aiart_class_pre");
  },
  filename: function (req, file, callback) {
    callback(null, String(Date.now()) + ".jpg");
  },
});
const typeUpload = multer({ storage: typeStorage });

// 添加類型
router.post(
  "/add-art-type",
  typeUpload.array("files"),
  async (req, res, next) => {
    const body = await req.body;
    const preImageName = await req.files[0].filename;

    const result = createAiArtType(body.class_key, body.title, preImageName);
    if (result) {
      return result.then((aiartData) => {
        return res.status(201).json({
          message: "類型添加成功!",
          status: Number(201),
        });
      });
    }
  }
);

// -------------------------------------------------------------------------------------------------------

// 原圖圖庫預覽图片 ----------------
const imageStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images/aiart_pre");
  },
  filename: function (req, file, callback) {
    callback(null, String(Date.now()) + ".jpg");
  },
});
const imageUpload = multer({ storage: imageStorage });
// 添加圖片
router.post(
  "/add-ai-image",
  imageUpload.array("files"),
  async (req, res, next) => {
    const body = await req.body;
    const preImageName = await req.files[0].filename;
    const result = createAiArtImage(
      body.class_key,
      body.watch_level,
      preImageName,
      body.org_img
    );
    if (result) {
      return result.then((data) => {
        return res.status(201).json({
          message: "圖片添加成功",
          status: Number(201),
        });
      });
    }
  }
);

router.post("/add-blog-post", async (req, res, next) => {
  const body = await req.body;
  const result = createBlogPost(body.title, body.type, body.level, body.link);

  const data = await result;
  console.log(data);
  return res.json({
    message: "文章添加成功!",
  });
});

router.post("/add-card-key", async (req, res, next) => {
  const body = await req.body;
  const length = genCardLength(body.cardTable);
  if (length >= 6) {
    let amount = 100;
    const tableName = body.cardTable;
    while (amount > 0) {
      // 新的卡号
      let card_key = genCardKey(length);

      let result = createCardKey(tableName, card_key);

      let data = await result;

      if (data) {
        // console.log(data);
      }

      amount--;
    }
    return res.status(201).json({
      message: "卡號添加成功!",
      status: Number(201),
    });
  } else {
    return res
      .status(501)
      .send({ error: 1, message: "长度生成错误,您的卡号长度不正确!" });
  }
});

router.post("/refresh-card-key", async (req, res, next) => {
  const body = await req.body;
  const length = genCardLength(body.refreshCardTable);
  if (length >= 6) {
    let amount = 100;
    const refreshCardTableName = body.refreshCardTable;
    for (let i = 1; i < amount; i++) {
      let card_key = genCardKey(length);
      let result = refreshCardKey(refreshCardTableName, card_key, Number(i));
      let data = await result;
      if (data) {
        continue;
      }
    }
    return res.status(201).json({
      message: "卡密刷新成功!",
      status: Number(201),
    });
  } else {
    return res
      .status(501)
      .send({ error: 1, message: "表類型錯誤,請檢查表名稱!" });
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const result = loging(email, password);
  if (result) {
    result.then((userData) => {
      if (userData.email) {
        req.session.admin = true;
        return res.redirect("/admin/bjloveyou-admin-page");
      }
    });
  }
});

// 登出
router.get("/logout", async (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/bjloveyou-admin-page");
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res.redirect("/admin/bjloveyou-admin-page");
  });
});

module.exports = router;
