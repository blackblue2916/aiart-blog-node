const express = require("express");
const router = express.Router();

const {
  getPostsList,
  getPostsLimit,
  getPostById,
} = require("../controller/blog.cont");

const limit = 28;
let result = null;

router.get("/list", async function (req, res, next) {
  let loading = true;
  if (!result) {
    result = getPostsList();
  }
  if (result) {
    return result.then((listData) => {
      // 縂條目
      const resultCount = listData.length;
      // 縂頁數
      const pages = Math.ceil(resultCount / limit);
      // 當前請求頁
      let page = req.query.page ? Number(req.query.page) : 1;
      if (page > pages) {
        page = pages - 1;
      } else if (page < 1) {
        page = 1;
      }
      // 當前頁起始數
      let startIndex = (page - 1) * limit;
      // 獲取當前頁所有條目
      const limitResult = getPostsLimit(startIndex < 0 ? 0 : startIndex, limit);
      if (limitResult) {
        return limitResult.then((limitData) => {
          let iterator = page - 5 < 1 ? 1 : page - 5;
          let endingLink =
            iterator + 5 <= pages ? iterator + 5 : page + (pages - page);
          if (endingLink < page + 4) {
            iterator -= page + 4 - pages;
          }
          loading = false;
          return res.render("blog", {
            title: "像素猴子博客 | AI ART | AI 畫廊 | AI 圖像技術",
            data: limitData,
            page: page,
            iterator: iterator,
            endingLink: endingLink,
            pages: pages,
            resultCount: resultCount,
            user: {
              id: res.userid,
              email: res.useremail,
              level: res.userlevel,
              conn_key: res.conn_key,
              login: res.login,
              title: res.title,
              apikey: "",
            },
            focus: "list",
            loading: loading,
          });
        });
      }
    });
  }
});

router.get("/list/:id", async (req, res, next) => {
  const id = req.params.id;
  const result = getPostById(Number(id));
  if (result) {
    result.then((data) => {
      if (data) {
        return res.render(`blog-posts/blog_${id}`, {
          title: "像素猴子博客 | AI ART | AI 畫廊 | AI 圖像技術",
          data: data[0],
          user: {
            id: res.userid,
            email: res.useremail,
            level: res.userlevel,
            conn_key: res.conn_key,
            login: res.login,
            title: res.title,
            apikey: "",
          },
          focus: "list",
        });
      }
    });
  }
});

module.exports = router;
