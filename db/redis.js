const redis = require('redis');
const { REDIS_CONF } = require('../conf/dbConf');

// V redis 3.0 --
// const redisClient = redis.createClient({
//     port: REDIS_CONF.port,
//     host: REDIS_CONF.host
// });

// redisClient.on('error', err => { console.error(err) });


// V redis 3.2 ++
const redisClient = redis.createClient({
    socket: {
        port: 6379,
        host: REDIS_CONF.host,
        legacyMode: true
    }
});

redisClient.on('err', err => { console.log('Redis client error: ', err) });

redisClient.connect().catch(console.error);

const set = async (key, value) => {

    // await redisClient.connect().catch(console.error);
    if (typeof key === 'object') {
        key = JSON.stringify();
    }

    if (typeof value === 'object') {
        value = JSON.stringify();
    }
    await redisClient.set(key, value);

    // await redisClient.quit();
}

const get = async (key) => {

    if (typeof key === 'object') {
        key = JSON.stringify();
    }

    const value = await redisClient.get(key);

    if (value) {
        try {
            const value_tojson = await JSON.parse(value);
            // await redisClient.quit();
            return value_tojson;
        } catch (error) {
            // await redisClient.quit();
            return value;
        }
    }
    return null;
}

const del = async (key) => {

    if (typeof key === 'object') {
        key = JSON.stringify();
    }

    await redisClient.del(key);
}


module.exports = { redisClient, set, get, del };

// Redis test
// app.get('/redis-test', async (req, res, next) => {
//   // 版本 4.0 以上 每次必须链接一次
//   redisClient.connect().then(() => console.log('Redis connect'));
//   await redisClient.connect().catch(console.error);
//   const value = await redisClient.get('webinfo');
//   // const info = await redisClient.info();
//   // console.log(typeof info);

//   if (value) {
//     const value_tojson = await JSON.parse(value);
//     await redisClient.disconnect();
//     return res.status(200).send(value_tojson);
//   } else {
//     await redisClient.set('webinfo', JSON.stringify({
//       url: 'www.bjloveyou.com',
//       createAt: '2022-12-30',
//       email: 'bjloveyou@gmail.com'
//     }))
//     await redisClient.disconnect();
//     return res.status(200).json("数据写入成功了!");
//   }
// })
