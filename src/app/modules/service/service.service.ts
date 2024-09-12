import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TService } from "./service.interface";
import { ServiceModel } from "./service.model";

//create service
const createServiceIntoDB = async (payLoad: TService) => {
  const result = await ServiceModel.create(payLoad);

  return result;
};

//get service
const getServicesFromDB = async () => {
  const result = await ServiceModel.find({ isDeleted: false });

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

  return result;
};

export const CarServiceServices = {
  createServiceIntoDB,
  getServicesFromDB,
  getServiceByIDFromDB,
  deleteServiceByIDFromDB,
  updateServiceByIDIntoDB,
};
