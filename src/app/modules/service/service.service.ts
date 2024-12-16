import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TService } from "./service.interface";
import { ServiceModel } from "./service.model";
import config from "../../config";
import { cacheData, deleteCachedData, getCachedData } from "../../utils/redis.utils";
import { paginationData } from "../../utils/paginationData";

const redisCacheKeyPrefix = config.redis_cache_key_prefix;
const redisTTL = parseInt(config.redis_ttl as string);

//create service
const createServiceIntoDB = async (payLoad: TService) => {
  const result = await ServiceModel.create(payLoad);

  await deleteCachedData(`${redisCacheKeyPrefix}:service:page:*`);

  return result;
};

//get service
const getServicesFromDB = async (
  page: number,
  searchQuery?: string,
  category?: string,
  sortBy?: 'asc' | 'desc'
) => {
  const limit = 12;
  const skip = (page - 1) * limit;

  // Start with base query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { isDeleted: false };

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

  const total = await ServiceModel.countDocuments(query);
  // const totalPages = Math.ceil(total / limit);

 

  // Only use cache for non-filtered, non-searched requests
  if (!isFilteredOrSearched) {
    const cacheKey = `${redisCacheKeyPrefix}:service:page:${page}`;
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {

      const paginationResultData = paginationData(page, limit, total, cachedData);

      return {
        data: cachedData,
        meta: paginationResultData
      };
    }
  }

  // Create sort object
  let sortOptions = {};
  if (sortBy && ['asc', 'desc'].includes(sortBy)) {
    sortOptions = { price: sortBy === 'asc' ? 1 : -1 };
  }

  // Execute query with all conditions
  const result = await ServiceModel.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .exec();

  const paginationResultData = paginationData(page, limit, total, result);

  const paginationResult = {
    data: result,
    meta: paginationResultData
  };

  // Only cache if there's no filtering or searching
  if (!isFilteredOrSearched && paginationResult.data.length > 0) {
    const cacheKey = `${redisCacheKeyPrefix}:service:page:${page}`;
    await cacheData(cacheKey, paginationResult, redisTTL);
  }

  return paginationResult;
};

//get single service
const getServiceByIDFromDB = async (id: string) => {
  const result = await ServiceModel.findOne({
    _id: id,
  });

  const isServiceDeleted = result?.isDeleted;

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Service is not found");
  }

  if (isServiceDeleted === true) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service is not found. This service already deleted",
    );
  }

  return result;
};

//delete single service
const deleteServiceByIDFromDB = async (id: string) => {
  const service = await ServiceModel.findOne({
    _id: id,
  });

  const isServiceDeleted = service?.isDeleted;

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service is not found");
  }

  if (isServiceDeleted === true) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service is not found. This service already deleted",
    );
  }

  const result = await ServiceModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  await deleteCachedData(`${redisCacheKeyPrefix}:service:page:*`);

 
   return result;

};

const updateServiceByIDIntoDB = async (
  id: string,
  payload: Partial<TService>,
) => {
  const singleService = await ServiceModel.findOne({
    _id: id,
  });

  const isServiceDeleted = singleService?.isDeleted;

  if (!singleService) {
    throw new AppError(httpStatus.NOT_FOUND, "Service is not found");
  }

  if (isServiceDeleted === true) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service couldn't update. This service already deleted",
    );
  }

  const result = await ServiceModel.findByIdAndUpdate(id, payload, {
    new: true,
  }).exec();

  // Only invalidate the most commonly used limit's cache
  const commonLimit = 12; // or whatever your most common limit is
  const position = await ServiceModel.countDocuments({
    _id: { $lt: id },
    isDeleted: false
  });
  const affectedPage = Math.ceil((position + 1) / commonLimit);

  await deleteCachedData(
    `${redisCacheKeyPrefix}:service:page:${affectedPage}`
  );

  return result;
};

export const CarServiceServices = {
  createServiceIntoDB,
  getServicesFromDB,
  getServiceByIDFromDB,
  deleteServiceByIDFromDB,
  updateServiceByIDIntoDB,
};
