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
exports.CarServiceServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const service_model_1 = require("./service.model");
const config_1 = __importDefault(require("../../config"));
const redis_utils_1 = require("../../utils/redis.utils");
const redisCacheKeyPrefix = config_1.default.redis_cache_key_prefix;
const redisTTL = parseInt(config_1.default.redis_ttl);
//create service
const createServiceIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.ServiceModel.create(payLoad);
    yield (0, redis_utils_1.deleteCachedData)(`${redisCacheKeyPrefix}:service:page:*`);
    return result;
});
//get service
const getServicesFromDB = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = 12;
    const skip = (page - 1) * limit;
    const cachedData = yield (0, redis_utils_1.getCachedData)(`${redisCacheKeyPrefix}:service:page:${page}`);
    if (cachedData) {
        return cachedData;
    }
    const result = yield service_model_1.ServiceModel.find({ isDeleted: false }).skip(skip).limit(limit);
    const total = yield service_model_1.ServiceModel.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(total / limit);
    const paginationResult = {
        data: result,
        meta: {
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            currentlyShowingData: result.length,
            totalData: total,
        }
    };
    if (paginationResult.data.length > 0) {
        yield (0, redis_utils_1.cacheData)(`${redisCacheKeyPrefix}:service:page:${page}`, paginationResult, redisTTL);
    }
    return paginationResult;
});
//get single service
const getServiceByIDFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.ServiceModel.findOne({
        _id: id,
    });
    const isServiceDeleted = result === null || result === void 0 ? void 0 : result.isDeleted;
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found");
    }
    if (isServiceDeleted === true) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found. This service already deleted");
    }
    return result;
});
//delete single service
const deleteServiceByIDFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.ServiceModel.findOne({
        _id: id,
    });
    const isServiceDeleted = service === null || service === void 0 ? void 0 : service.isDeleted;
    if (!service) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found");
    }
    if (isServiceDeleted === true) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found. This service already deleted");
    }
    const result = yield service_model_1.ServiceModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    yield (0, redis_utils_1.deleteCachedData)(`${redisCacheKeyPrefix}:service:page:*`);
    return result;
});
const updateServiceByIDIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const singleService = yield service_model_1.ServiceModel.findOne({
        _id: id,
    });
    const isServiceDeleted = singleService === null || singleService === void 0 ? void 0 : singleService.isDeleted;
    if (!singleService) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found");
    }
    if (isServiceDeleted === true) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service couldn't update. This service already deleted");
    }
    const result = yield service_model_1.ServiceModel.findByIdAndUpdate(id, payload, {
        new: true,
    }).exec();
    // Only invalidate the most commonly used limit's cache
    const commonLimit = 12; // or whatever your most common limit is
    const position = yield service_model_1.ServiceModel.countDocuments({
        _id: { $lt: id },
        isDeleted: false
    });
    const affectedPage = Math.ceil((position + 1) / commonLimit);
    yield (0, redis_utils_1.deleteCachedData)(`${redisCacheKeyPrefix}:service:page:${affectedPage}`);
    return result;
});
exports.CarServiceServices = {
    createServiceIntoDB,
    getServicesFromDB,
    getServiceByIDFromDB,
    deleteServiceByIDFromDB,
    updateServiceByIDIntoDB,
};
