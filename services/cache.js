const mongoose = require('mongoose');
const redis = require('redis');
const keys = require('../config/keys')
const { promisify } = require('util')
const client = redis.createClient(keys.redisUrl);
client.hget = promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || "");
    return this;
}

mongoose.Query.prototype.exec = async function () {

    if (!this.useCache) {
        return await exec.apply(this, arguments)
    }
    let key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }))
    //see we have key, if we do store that
    const cachedValue = await client.hget(this.hashKey, key);
    if (cachedValue) {
        let res = JSON.parse(cachedValue)

        return Array.isArray(res)
            ? res.map(d => new this.model(d))
            : new this.model(res);

    }
    //save it
    let res = await exec.apply(this, arguments);
    client.hset(this, hashKey, key, JSON.stringify(res), 'EX', 30);
    return res;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}