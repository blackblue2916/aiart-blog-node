const express = require("express");
const router = express.Router();
const {
  login,
  register,
  checkEmail,
  updateConnKey,
} = require("../controller/user.cont");
const { set, get, del } = require("../db/redis");

// 登錄页面
router.get("/login-page", (req, res, next) => {
  if (req.session.browser_cli_id == null) {
    return res.render("login", {
      title: "像素猴子博客|登錄頁面",
      state: "none",
      err: "",
      msg: "",
    });
  }
  return res.redirect("/");
});

// 注册页面
router.get("/register-page", (req, res, next) => {
  if (req.session.browser_cli_id == null) {
    return res.render("register", {
      title: "像素猴子博客|注冊頁面",
      state: "none",
      err: "",
      msg: "",
    });
  }
  return res.redirect("/");
});

// 登錄
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  const result = login(email, password);
  let state = "none";
  if (result) {
    result.then((userData) => {
      if (userData) {
        const userResult = updateConnKey(userData.id);
        if (userResult) {
          userResult.then((updateCompleted) => {
            if (updateCompleted) {
              // 设置 session, cookies
              req.session.browser_cli_id = req.cookies.browser_cli_id;
              console.log(req.session.browser_cli_id);
              req.session.login = true;
              set(
                `${req.session.browser_cli_id}`,
                `{"id":"${userData.id}","email":"${userData.email}","vip_level":"${userData.vip_level}","title":"${userData.title}","silver_coin":"${userData.silver_coin}","conn_key":"${userData.conn_key}"}`
              ).then(() => {
                // 登录成功,定位到首页
                return res.redirect("/");
              });
            }
          });
        }
      } else {
        // 登录错误
        state = "err";
        return res.render("login", {
          title: "像素猴子博客|登錄頁面",
          state: state,
          err: "該賬戶不存在,或密碼錯誤,請確認輸入的訊息是否正確! - The account does not exist, or the password is wrong!",
          msg: "",
        });
      }
    });
  }
});

// 注冊
router.post("/register", (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  let state = "none";
  if (password != confirmPassword) {
    state = "err";
    return res.render("register", {
      title: "像素猴子博客|登錄頁面",
      state: state,
      err: "前後密碼不一致! - Two password do not match!",
      msg: "",
    });
  }

  const result = checkEmail(email);
  if (result) {
    return result.then((userData) => {
      if (userData.email) {
        state = "err";
        return res.render("register", {
          title: "像素猴子博客|登錄頁面",
          state: state,
          err: "這個郵箱已經被注冊了! - This email address has already been registered!",
          msg: "",
        });
      } else {
        const result = register(email, password);
        if (result) {
          return result.then((userData) => {
            if (userData) {
              console.log(userData.email);
              return res.redirect("/user/login-page");
            }
          });
        } else {
          return res.render("register", {
            title: "像素猴子博客|登錄頁面",
            state: state,
            err: "注冊失敗,請檢查網絡或稍後再試! - Registeraction failed,please try again!",
            msg: "",
          });
        }
      }
    });
  }
});

router.get("/premium", async (req, res, next) => {
  return res.render("premium", {
    title: "像素猴子博客 | AI ART | AI 畫廊 | AI 圖像技術",
    user: {
      id: res.userid,
      email: res.useremail,
      level: res.userlevel,
      conn_key: res.conn_key,
      loing: res.login,
      title: res.title,
    },
    focus: "premium",
  });
});

// 用戶界面
router.get("/profile", async (req, res, next) => {
  if (!req.session.browser_cli_id) {
    return res.redirect("/user/login-page");
  }
  try {
    let user_info = await get(`${req.session.browser_cli_id}`);
    if (user_info) {
      return res.render("profile", {
        title: "像素猴子博客|用戶頁面",
        data: user_info,
        msg: "歡迎 - Welcom!",
        msg: "",
      });
    }
  } catch (error) {
    return res.send(500).json("獲取數據失敗: ", error);
  }
});

// 登出
router.get("/logout", async (req, res, next) => {
  if (!req.session.browser_cli_id) {
    return res.redirect("/");
  }

  del(`${req.session.browser_cli_id}`).then(() => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      return res.redirect("/");
    });
  });
});

module.exports = router;
