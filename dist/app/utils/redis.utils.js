"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllCachedData = exports.deleteCachedData = exports.getCachedData = exports.cacheData = void 0;
/* eslint-disable no-console */
const redis_config_1 = __importDefault(require("../config/redis.config"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cacheData = (key, data, expirationTime) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis_config_1.default.setEx(key, expirationTime, JSON.stringify(data));
    }
    catch (error) {
        console.error('Error caching data:', error);
    }
});
exports.cacheData = cacheData;
const getCachedData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield redis_config_1.default.get(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }
    catch (error) {
        console.error('Error getting cached data:', error);
        return null;
    }
});
exports.getCachedData = getCachedData;
const deleteCachedData = (pattern) => __awaiter(void 0, void 0, void 0, function* () {
    // try{
    //     await redisClient.del(key);
    //     console.log('Cached data deleted successfully');
    // } catch (error) {
    //     console.error('Error deleting cached data:', error);
    // }
    try {
        const keys = yield redis_config_1.default.keys(pattern);
        if (keys.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            yield redis_config_1.default.del(...keys);
        }
        return true;
    }
    catch (error) {
        console.error('Redis delete error:', error);
        return false;
    }
});
exports.deleteCachedData = deleteCachedData;
const clearAllCachedData = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_config_1.default.flushAll();
});
exports.clearAllCachedData = clearAllCachedData;
