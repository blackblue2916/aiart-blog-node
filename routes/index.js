const express = require("express");
const router = express.Router();
const { getLatestPostsLimit } = require("../controller/index.cont");

const limit = 6;

/* GET home page. */
router.get("/", async function (req, res, next) {
  const latestPostsResult = getLatestPostsLimit(limit);
  const postsData = await latestPostsResult;
  try {
    if (postsData) {
      return res.render("index", {
        title: "像素猴子博客 | AI ART | AI 畫廊 | AI 圖像技術 | 網站開發",
        postsData: postsData,
        user: {
          id: res.userid,
          email: res.useremail,
          level: res.userlevel,
          conn_key: res.conn_key,
          login: res.login,
          title: res.title,
        },
        focus: "home",
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = router;
