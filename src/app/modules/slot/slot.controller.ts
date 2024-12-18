import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.";
import sendResponse from "../../utils/sendResponse";
import { SlotServices } from "./slot.service";
import { noDataFoundResponse } from "../../utils/noDataFoundResponse";

const createSlotController = catchAsync(async (req, res) => {
  const result = await SlotServices.createSlotIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slots created successfully",
    data: result,
  });
});

const getSlotController = catchAsync(async (req, res) => {
  const { date, serviceId } = req.query;

  const result = await SlotServices.getSlotsFromDB(
    date as string,
    serviceId as string,
  );

  //if there is no data
  if(result.length === 0){
    noDataFoundResponse(res, result);
  }
  else{
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Available slots retrieved successfully",
    data: result,
  });
  }
 

 
});

const updateSlotStatusController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isBooked } = req.body;
  const result = await SlotServices.updateSlotStatusInDB(id, isBooked);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slot status updated successfully",
    data: result,
  });
});

const getSlotByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SlotServices.getSlotByIdFromDB(id);

  if(!result){
    noDataFoundResponse(res, result);
  }
  else{
    sendResponse(res, { 
      success: true,
      statusCode: httpStatus.OK,
      message: "Slot retrieved successfully",
      data: result,
    });
  }
 
});

export const SlotControllers = {
  createSlotController,
  getSlotController,
  updateSlotStatusController,
  getSlotByIdController,
};
