"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries >= 3) {
                return new Error("Failed to connect to Redis");
            }
            return Math.min(retries * 50, 2000);
        }
    }
});
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('ready', () => console.log('Redis Client Ready'));
redisClient.on('reconnecting', () => console.log('Redis Client Reconnecting'));
redisClient.on('end', () => console.log('Redis Client Ended'));
redisClient.connect().catch(err => console.error('Redis Connection Error:', err));
exports.default = redisClient;
