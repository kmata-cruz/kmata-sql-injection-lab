const { createClient } = require('redis');
const logger = require('./logger');

const redisHost = process.env.REDIS_HOST || 'localhost';
const client = createClient({
    url: `redis://${redisHost}:6379`
});

client.on('error', err => logger.error('Redis Client Error', err));

async function connectRedis() {
    try {
        await client.connect();
        logger.info('Conectado a Redis');
    } catch (err) {
        logger.error('Error conectando a Redis:', err);
    }
}

module.exports = { client, connectRedis };
