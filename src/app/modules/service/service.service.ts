import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TService } from "./service.interface";
import { ServiceModel } from "./service.model";
import config from "../../config";
import { cacheData, deleteCachedData, getCachedData } from "../../utils/redis.utils";

const redisCacheKeyPrefix = config.redis_cache_key_prefix;
const redisTTL = parseInt(config.redis_ttl as string);

//create service
const createServiceIntoDB = async (payLoad: TService) => {
  const result = await ServiceModel.create(payLoad);

  await deleteCachedData(`${redisCacheKeyPrefix}:service:page:*`);

  return result;
};

//get service
const getServicesFromDB = async (page: number) => {
  const limit = 12
  const skip = (page - 1) * limit;

  const cachedData = await getCachedData(`${redisCacheKeyPrefix}:service:page:${page}`);

  if(cachedData){
    return cachedData;
  }

  const result = await ServiceModel.find({ isDeleted: false }).skip(skip).limit(limit);

  const total = await ServiceModel.countDocuments({isDeleted: false});
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
  }

  if(paginationResult.data.length > 0){
    await cacheData(`${redisCacheKeyPrefix}:service:page:${page}`, paginationResult, redisTTL);
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
