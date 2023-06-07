const { get } = require("../db/redis");

function formCheck() {
  return async (req, res, next) => {
    const body = await req.body;
    if (body.title.length < 10 || body.description.length < 15) {
      req.body = null;
      console.log("内容格式無效,過於簡單.");
    }
    next();
  };
}

function checkClientLogin() {
  return async (req, res, next) => {
    let login = "null";
    let userid = -1;
    let email = "null";
    let userlevel = 1;
    let conn_key = "null";
    let title = "null";
    if (req.session.login) {
      login = "login";
    }
    if (login == "login") {
      let user_info = await get(`${req.session.browser_cli_id}`);
      userid = user_info.id;
      email = user_info.email;
      userlevel = user_info.vip_level;
      conn_key = user_info.conn_key;
      title = user_info.title;
    }
    res.userid = userid;
    res.useremail = email;
    res.userlevel = userlevel;
    res.conn_key = conn_key;
    res.login = login;
    res.title = title;
    next();
  };
}

function checkAdminLogin() {
  return async (req, res, next) => {
    let admin = req.session.admin;
    if (admin) {
      next();
    } else {
      res.render("adminLogin", {
        title: "主播愛你|管理员登录页面",
        message: "请登录您的管理员账户!",
      });
    }
  };
}

module.exports = { formCheck, checkClientLogin, checkAdminLogin };
