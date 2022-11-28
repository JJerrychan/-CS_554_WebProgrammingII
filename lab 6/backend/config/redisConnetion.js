const redis = require('redis');
let client = undefined;

const connectToRedis = () => {
  if (!client) {
    client = redis.createClient();
    client.on('error', (err) => {
      console.log('Redis Client Error', err);
    });
    client.connect();
  }
  return client;
};

module.exports = { redisClient: connectToRedis() };
