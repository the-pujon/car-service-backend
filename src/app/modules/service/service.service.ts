import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { MongooseQueryFilters, PaginationParams, ServiceMetrics, ServiceOverview, TService } from "./service.interface";
import { ServiceModel } from "./service.model";
import config from "../../config";
import { cacheData, deleteCachedData, getCachedData } from "../../utils/redis.utils";
import { paginationData } from "../../utils/paginationData";
import { BookingModel } from "../booking/booking.model";

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
         ...cachedData,
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

//update service
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



const calculateServiceMetrics = async (
  service: TService,
  totalBookings: number,
  totalRevenue: number
): Promise<ServiceMetrics> => {
  try {
    const serviceBookings = await BookingModel.find({ 
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
      (sum, booking) => sum + ((booking.service as any)?.price || 0),
      0
    );

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
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Error calculating metrics for this ${service.name} service`);

  }
};

const buildQueryFilters = (params: PaginationParams) => {
  const filters: MongooseQueryFilters = {};
  
  if (params.search) {
    filters.name = { $regex: params.search, $options: 'i' };
  }
  
  if (params.category) {
    filters.category = params.category;
  }
  
  return filters;
};

export const getServiceOverviewFromDB = async (
  paginationParams: PaginationParams
): Promise<ServiceOverview> => {
  try {
    const { page = 1, limit = 10 } = paginationParams;
    const skip = (page - 1) * limit;
    const queryFilters = buildQueryFilters(paginationParams);

    // Get paginated services and counts
    const [
      services,
      totalServices,
      totalActiveServices,
      bookings
    ] = await Promise.all([
      ServiceModel.find(queryFilters)
        .skip(skip)
        .limit(limit)
        .lean(),
      ServiceModel.countDocuments(queryFilters),
      ServiceModel.countDocuments({ ...queryFilters, isDeleted: false }),
      BookingModel.find()
        .populate({
          path: 'service',
          select: 'price -_id isDeleted',
        })
        .lean(),
    ]);

    // Calculate total revenue once
    const totalRevenue = bookings.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum, booking) => sum + ((booking.service as any)?.price || 0),
      0
    );

    // Calculate metrics for paginated services
    const servicesWithMetrics = await Promise.all(
      services.map(service => 
        calculateServiceMetrics(service, bookings.length, totalRevenue)
      )
    );

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
  } catch (error) {
    // console.error('Error getting service overview:', error);
    // throw error;
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error getting service overview');
  }
};


export const CarServiceServices = {
  createServiceIntoDB,
  getServicesFromDB,
  getServiceByIDFromDB,
  deleteServiceByIDFromDB,
  updateServiceByIDIntoDB,
  getServiceOverviewFromDB
};
