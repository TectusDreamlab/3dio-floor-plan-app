const configs = require('../../configs.js')
const redis = require('redis');
const bluebird = require('bluebird');

client = redis.createClient(configs.redis_url);
// This is to promisify all the redis client functions.
bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = function getClient () {
  return client;
}
