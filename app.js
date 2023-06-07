require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const { SHUTDOWN } = require("./conf/appConf");

const indexRouter = require("./routes/index");
const blogRouter = require("./routes/blog");
const aiartRouter = require("./routes/aiart");
const premiumRouter = require("./routes/premium");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const app = express();

// 全局 Email 檢測
const { checkClientLogin } = require("./middleware/app.middleware");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(logger("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3012",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/images", express.static(__dirname + "public/images"));

// session
const sessionConfig = {
  resave: true, // 没有改变时不存储
  saveUninitialized: true, // 即使用户未登录,依然创建
  secret: process.env.SESSION_SECRET, // 类似MD5加密
  name: "browser_cli_id",
  cookier: {
    path: "/",
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionConfig));

// 總綫函數
app.use("*", checkClientLogin(), async (req, res, next) => {
  if (SHUTDOWN) {
    return res
      .status(501)
      .json({ massage: "服務器維護中,預計24小時后開放! - Server Shutdown!" });
  }

  console.log("session: ", req.session); // 打印 session 包含的内容 obiect
  console.log("login: ", res.login);

  // console.log("user id: ", res.userid);
  console.log("user email: ", res.useremail);
  // console.log("user level: ", res.userlevel);
  // console.log("user conn_key: ", res.conn_key);
  // console.log('cookies: ', req.cookies);  // 打印 cookies 包含的内容 object
  console.log("cli_id: ", req.cookies.browser_cli_id);

  next();
});

app.use("/", indexRouter);
app.use("/blog", blogRouter);
app.use("/aiart", aiartRouter);
app.use("/premium", premiumRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    title: "頁面錯誤,找不到該頁面!",
    message: "出錯了,可能某些必要驗證失敗了!",
    error: {
      status: 500,
      stack: null,
    },
  });
});

module.exports = app;
