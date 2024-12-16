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

  await deleteCachedData(`${redisCacheKeyPrefix}:service`);

  return result;
};

//get service
const getServicesFromDB = async () => {

  const cachedData = await getCachedData(`${redisCacheKeyPrefix}:service`);

  if(cachedData){
    return cachedData;
  }

  const result = await ServiceModel.find({ isDeleted: false });

  await cacheData(`${redisCacheKeyPrefix}:service`, result, redisTTL);

  return result;
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

   // Get current cached services
   const cachedServices = await getCachedData(`${redisCacheKeyPrefix}:service`);
  
   if (cachedServices) {
     // Filter out the deleted service
     const updatedServices = cachedServices.filter(
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       (service: any) => service._id !== id
     );
     
     // Update the cache with the filtered services
     await cacheData(
       `${redisCacheKeyPrefix}:service`, 
       updatedServices, 
       redisTTL
     );
   }
 
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

  // Get current cached services
  const cachedServices = await getCachedData(`${redisCacheKeyPrefix}:service`);
  
  if (cachedServices) {
    // Update the service in cached data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedServices = cachedServices.map((service: any) => 
      service._id === id ? result : service
    );
    
    // Update the cache with modified services
    await cacheData(
      `${redisCacheKeyPrefix}:service`, 
      updatedServices, 
      redisTTL
    );
  }

  return result;
};

export const CarServiceServices = {
  createServiceIntoDB,
  getServicesFromDB,
  getServiceByIDFromDB,
  deleteServiceByIDFromDB,
  updateServiceByIDIntoDB,
};
