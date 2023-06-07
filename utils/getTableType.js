// 用於視頻網站
function videoType(typeKeys) {
  if (typeKeys == String(process.env.DANCE_TYPE)) {
    return "dance_data";
  } else if (typeKeys == String(process.env.ASMR_TYPE)) {
    return "asmr_data";
  } else if (typeKeys == String(process.env.AUDIO_TYPE)) {
    return "audio_data";
  } else if (typeKeys == String(process.env.IV_TYPE)) {
    return "iv_data";
  } else {
    return "null table";
  }
}

function cardTypeAndData(card_key) {
  let length = Number(card_key.length);
  let data = {};
  switch (length) {
    case 12:
      data = {
        table: "coin_2000",
        vip_level: 1,
        silver_coin: 2000,
        noble_name: "初心者",
        expiration: 0,
      };
      break;

    case 14:
      data = {
        table: "coin_5000",
        vip_level: 1,
        silver_coin: 5000,
        noble_name: "初心者",
        expiration: 0,
      };
      break;

    case 16:
      data = {
        table: "silver_7",
        vip_level: 2,
        silver_coin: 300,
        noble_name: "白銀會員",
        expiration: 7 * 24 * 60 * 60 * 1000,
      };
      break;

    case 18:
      data = {
        table: "silver_180",
        vip_level: 2,
        silver_coin: 800,
        noble_name: "白銀會員",
        expiration: 180 * 24 * 60 * 60 * 1000,
      };
      break;

    case 20:
      data = {
        table: "silver_360",
        vip_level: 3,
        silver_coin: 1600,
        noble_name: "白銀會員",
        expiration: 360 * 24 * 60 * 60 * 1000,
      };
      break;

    case 22:
      data = {
        table: "gold_180",
        vip_level: 5,
        silver_coin: 3000,
        noble_name: "黃金會員",
        expiration: 180 * 24 * 60 * 60 * 1000,
      };
      break;

    case 24:
      data = {
        table: "gold_360",
        vip_level: 8,
        silver_coin: 6000,
        noble_name: "黃金會員",
        expiration: 360 * 24 * 60 * 60 * 1000,
      };
      break;

    case 26:
      data = {
        table: "gold_forever",
        vip_level: 99,
        silver_coin: 50000,
        noble_name: "黃金會員",
        expiration: 3600 * 24 * 60 * 60 * 1000,
      };
      break;

    default:
      data = null;
      break;
  }
  return data;
}

function genCardLength(cardTableName) {
  let keyLength = 0;
  switch (cardTableName) {
    case "coin_2000":
      keyLength = 6; // 12
      break;

    case "coin_5000":
      keyLength = 7; // 14
      break;

    case "silver_7":
      keyLength = 8; // 16
      break;

    case "silver_180":
      keyLength = 9; // 18
      break;

    case "silver_360":
      keyLength = 10; // 20
      break;

    case "gold_180":
      keyLength = 11; // 22
      break;

    case "gold_360":
      keyLength = 12; // 24
      break;

    case "gold_forever":
      keyLength = 13; // 26
      break;

    default:
      keyLength = 0;
      break;
  }

  return keyLength;
}

module.exports = { videoType, cardTypeAndData, genCardLength };
