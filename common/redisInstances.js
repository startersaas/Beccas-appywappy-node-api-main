import Promise from "bluebird";
import redis from "redis";

Promise.promisifyAll(redis);

const redisResetTokens = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: 4,
});
const redisCacheCommon = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: 5,
});
module.exports = { redisResetTokens, redisCacheCommon };
