const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  port: "3306",
  database: "bjloveyou_com",
});

const danceData = require("../db/backup/DanceVideos");
const asmrData = require("../db/backup/AsmrVideos");
const audioData = require("../db/backup/AudioVideos");
const ivData = require("../db/backup/IvVideos");
const eventData = require("../db/backup/EventPrizes");

con.connect(function (err) {
  if (err) {
    console.error("mysql connect error: " + err.stack);
    return;
  }
  console.log("mysql connect as id: " + con.threadId);
});

async function exec(sql_query) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql_query, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      resolve(result);
    });
  });
  return promise;
}

async function addData(db_data, tableName) {
  console.log(db_data.length);
  const max = db_data.length;
  let index = 0;
  while (index < max) {
    let sql_query = `INSERT INTO ${tableName} (bj_name, title, play_link, download_link, image_url, watch_level, watch_coin, download_coin, create_at, views) VALUES ('${
      db_data[index].bjName
    }', '${db_data[index].info}', '${db_data[index].videoMainUrl}', '#', '${
      db_data[index].imgUrl
    }', ${1}, ${10}, ${100}, '${db_data[index].createAt}', ${
      db_data[index].views
    }) `;

    await exec(sql_query);

    index++;
  }
}

async function addEventData(db_data, tableName) {
  console.log(db_data.length);
  const max = db_data.length;
  let index = 0;
  while (index < max) {
    let sql_query = `INSERT INTO ${tableName} (title, image_url, preview_link, download_link, silver_coin, code, unzip_code, info, create_at) VALUES ('${
      db_data[index].title
    }', '${db_data[index].imgUrl}', '${db_data[index].videoMainUrl}', '${
      db_data[index].shareLink
    }', ${100}, '${db_data[index].code}', '${db_data[index].unzipCode}', '${
      db_data[index].describe
    }', '${db_data[index].createAt}') `;

    await exec(sql_query);

    index++;
  }
}

// INSERT INTO `dance_data`(`id`, `bj_name`, `title`, `play_link`, `download_link`, `image_url`, `watch_level`, `watch_coin`, `download_coin`, `create_at`)
// VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]','[value-9]','[value-10]')

// addData(ivData, "iv_data");
// addEventData(eventData, "event_data");
