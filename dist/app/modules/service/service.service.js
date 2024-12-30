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
exports.CarServiceServices = exports.getServiceOverviewFromDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const service_model_1 = require("./service.model");
const config_1 = __importDefault(require("../../config"));
const redis_utils_1 = require("../../utils/redis.utils");
const paginationData_1 = require("../../utils/paginationData");
const booking_model_1 = require("../booking/booking.model");
const redisCacheKeyPrefix = config_1.default.redis_cache_key_prefix;
const redisTTL = parseInt(config_1.default.redis_ttl);
//create service
const createServiceIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.ServiceModel.create(payLoad);
    yield (0, redis_utils_1.deleteCachedData)(`${redisCacheKeyPrefix}:service:page:*`);
    return result;
});
//get service
const getServicesFromDB = (page, searchQuery, category, sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = 12;
    const skip = (page - 1) * limit;
    // Start with base query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query = { isDeleted: false };
    // If there are any filters or search, skip cache
    const isFilteredOrSearched = !!(searchQuery || category || sortBy);
    // Add search functionality if searchQuery exists
    if (searchQuery && searchQuery.trim()) {
        query.$and = [
            {
                $or: [
                    { name: { $regex: searchQuery.trim(), $options: 'i' } },
                    { description: { $regex: searchQuery.trim(), $options: 'i' } },
                    { category: { $regex: searchQuery.trim(), $options: 'i' } }
                ]
            }
        ];
    }
    // Add category filter if category exists
    if (category && category.trim() !== '') {
        query.category = category;
    }
    const total = yield service_model_1.ServiceModel.countDocuments(query);
    // const totalPages = Math.ceil(total / limit);
    // Only use cache for non-filtered, non-searched requests
    if (!isFilteredOrSearched) {
        const cacheKey = `${redisCacheKeyPrefix}:service:page:${page}`;
        const cachedData = yield (0, redis_utils_1.getCachedData)(cacheKey);
        if (cachedData) {
            const paginationResultData = (0, paginationData_1.paginationData)(page, limit, total, cachedData);
            return Object.assign(Object.assign({}, cachedData), { meta: paginationResultData });
        }
    }
    // Create sort object
    let sortOptions = {};
    if (sortBy && ['asc', 'desc'].includes(sortBy)) {
        sortOptions = { price: sortBy === 'asc' ? 1 : -1 };
    }
    // Execute query with all conditions
    const result = yield service_model_1.ServiceModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();
    const paginationResultData = (0, paginationData_1.paginationData)(page, limit, total, result);
    const paginationResult = {
        data: result,
        meta: paginationResultData
    };
    // Only cache if there's no filtering or searching
    if (!isFilteredOrSearched && paginationResult.data.length > 0) {
        const cacheKey = `${redisCacheKeyPrefix}:service:page:${page}`;
        yield (0, redis_utils_1.cacheData)(cacheKey, paginationResult, redisTTL);
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
//update service
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
// //service overview
// const getServiceOverviewFromDB = async () => {
//   const services = await ServiceModel.find();
//   const totalActiveServices = await ServiceModel.countDocuments({isDeleted: false});
//   // console.log(totalServices)
//   const bookings = await BookingModel.find()
//   .populate({
//     path: 'service',
//     // match: { isDeleted: { $ne: true } },
//     // select: 'price -_id isDeleted',
//   });
//   const servicesWithMetrics = await Promise.all(services.map( async (service) => {
//     // const serviceBookings = bookings.filter(
//     //   (booking) => booking.service._id === service._id
//     // );
//     const serviceBookings = await BookingModel.find({ service: service._id }).select('service').populate({
//       path: 'service',
//       // match: { isDeleted: { $ne: true } },
//       select: 'price -_id isDeleted',
//     });
//     // if(serviceBookings.length !== 0){
//     //   console.log("serviceBookings", serviceBookings);
//     // }
//     const revenue = serviceBookings.reduce(
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (sum, booking) => sum + (booking.service as any).price,
//       0
//     );
//     // console.log(`bookings for ${service.name}: ${serviceBookings.length}`);
//     // console.log(`revenue for ${service.name}: `, revenue);
//     const bookingPercentage = (serviceBookings.length / bookings.length) * 100;
//     // console.log(`bookingPercentage for ${service.name}: `, bookingPercentage);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const revenuePercentage = (revenue / bookings.reduce((sum, booking) => sum + (booking.service as any).price, 0)) * 100;
//     // console.log(`revenuePercentage for ${service.name}: `, revenuePercentage);
//     const overviewResult = {
//       name: service.name,
//       category: service.category,
//       bookingPercentage: bookingPercentage.toFixed(2),
//       revenuePercentage: revenuePercentage.toFixed(2),
//       revenue,
//       bookings: serviceBookings.length,
//     }
//     return overviewResult
//   }))
//   const totalRevenue = bookings.reduce(
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     (sum, booking) => sum + (booking.service as any).price,
//     0
//   );
//   // console.log(servicesWithMetrics);
//   // console.log(totalRevenue)
//   // 
//   console.log(servicesWithMetrics)
//   return {
//     servicesWithMetrics,
//     totalActiveServices,
//     totalDeletedServices: services.length - totalActiveServices,
//     totalRevenue,
//     totalBookings: bookings.length
//   };
// };
// const serviceMatrics = async () => {
// }
const calculateServiceMetrics = (service, totalBookings, totalRevenue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceBookings = yield booking_model_1.BookingModel.find({
            service: service._id
        })
            .select('service')
            .populate({
            path: 'service',
            select: 'price -_id isDeleted',
        })
            .lean();
        const revenue = serviceBookings.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sum, booking) => { var _a; return sum + (((_a = booking.service) === null || _a === void 0 ? void 0 : _a.price) || 0); }, 0);
        const bookingPercentage = totalBookings ?
            ((serviceBookings.length / totalBookings) * 100) : 0;
        const revenuePercentage = totalRevenue ?
            ((revenue / totalRevenue) * 100) : 0;
        return {
            name: service.name,
            category: service.category,
            isDeleted: service.isDeleted,
            bookingPercentage: bookingPercentage.toFixed(2),
            revenuePercentage: revenuePercentage.toFixed(2),
            revenue,
            bookings: serviceBookings.length,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Error calculating metrics for this ${service.name} service`);
    }
});
const buildQueryFilters = (params) => {
    const filters = {};
    if (params.search) {
        filters.name = { $regex: params.search, $options: 'i' };
    }
    if (params.category) {
        filters.category = params.category;
    }
    return filters;
};
const getServiceOverviewFromDB = (paginationParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = paginationParams;
        const skip = (page - 1) * limit;
        const queryFilters = buildQueryFilters(paginationParams);
        // Get paginated services and counts
        const [services, totalServices, totalActiveServices, bookings] = yield Promise.all([
            service_model_1.ServiceModel.find(queryFilters)
                .skip(skip)
                .limit(limit)
                .lean(),
            service_model_1.ServiceModel.countDocuments(queryFilters),
            service_model_1.ServiceModel.countDocuments(Object.assign(Object.assign({}, queryFilters), { isDeleted: false })),
            booking_model_1.BookingModel.find()
                .populate({
                path: 'service',
                select: 'price -_id isDeleted',
            })
                .lean(),
        ]);
        // Calculate total revenue once
        const totalRevenue = bookings.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sum, booking) => { var _a; return sum + (((_a = booking.service) === null || _a === void 0 ? void 0 : _a.price) || 0); }, 0);
        // Calculate metrics for paginated services
        const servicesWithMetrics = yield Promise.all(services.map(service => calculateServiceMetrics(service, bookings.length, totalRevenue)));
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalServices / limit);
        return {
            servicesWithMetrics,
            totalActiveServices,
            totalDeletedServices: totalServices - totalActiveServices,
            totalRevenue,
            totalBookings: bookings.length,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalServices,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };
    }
    catch (error) {
        // console.error('Error getting service overview:', error);
        // throw error;
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error getting service overview');
    }
});
exports.getServiceOverviewFromDB = getServiceOverviewFromDB;
exports.CarServiceServices = {
    createServiceIntoDB,
    getServicesFromDB,
    getServiceByIDFromDB,
    deleteServiceByIDFromDB,
    updateServiceByIDIntoDB,
    getServiceOverviewFromDB: exports.getServiceOverviewFromDB
};
