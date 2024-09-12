import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.";
import sendResponse from "../../utils/sendResponse";
import { CarServiceServices } from "./service.service";
import { noDataFoundResponse } from "../../utils/noDataFoundResponse";

//create service controller
const createService = catchAsync(async (req, res) => {
  const result = await CarServiceServices.createServiceIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});

//get service controller
const getService = catchAsync(async (req, res) => {
  const result = await CarServiceServices.getServicesFromDB();

  //if there is no data
  noDataFoundResponse(res, result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieve successfully",
    data: result,
  });
});

//get single service controller
const getServiceById = catchAsync(async (req, res) => {
  const result = await CarServiceServices.getServiceByIDFromDB(req.params.id);

  //if there is no data
  noDataFoundResponse(res, result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieve successfully",
    data: result,
  });
});

//delete single service controller
const deleteServiceByID = catchAsync(async (req, res) => {
  const result = await CarServiceServices.deleteServiceByIDFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service deleted successfully",
    data: result,
  });
});

//update service controller
const updateServiceByID = catchAsync(async (req, res) => {
  const result = await CarServiceServices.updateServiceByIDIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service updated successfully",
    data: result,
  });
});

//exporting all controllers
export const ServiceControllers = {
  createService,
  getService,
  getServiceById,
  deleteServiceByID,
  updateServiceByID,
};
