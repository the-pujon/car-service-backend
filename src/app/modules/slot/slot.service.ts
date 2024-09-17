import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ServiceModel } from "../service/service.model";
import { TSlot } from "./slot.interface";
import { SlotModel } from "./slot.model";
import { SlotUtils } from "./slot.utils";

const createSlotIntoDB = async (payload: TSlot) => {
  const { date, endTime, startTime, service } = payload;

  const endTimeInMin = SlotUtils.timeToMinute(endTime);

  const startTimeInMin = SlotUtils.timeToMinute(startTime);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDuration = await ServiceModel.findById(service).select({
    duration: 1,
    _id: 0,
  });

  const duration = getDuration?.duration || 60;

  //if service id is invalid then throw error
  if (!getDuration) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid service id");
  }

  const existingSlot = await SlotModel.find({
    service,
    date,
    startTime: { $gte: startTime, $lt: endTime },
  });

  //throw error if slot overlap
  if (existingSlot.length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slot already exists");
  }

  const Slots = [];

  for (let time = startTimeInMin; time < endTimeInMin; time += duration) {
    const slotStartTime = SlotUtils.minuteToTime(time);
    const slotEndTime = SlotUtils.minuteToTime(time + duration);

    const slotData = {
      service,
      date,
      startTime: slotStartTime,
      endTime: slotEndTime,
    };

    const createSlotIntoDB = await SlotModel.create(slotData);

    Slots.push(createSlotIntoDB);
  }

  return Slots;
};

//getting slots
const getSlotsFromDB = async (date: string, serviceID: string) => {
  let result;

  if (date && serviceID) {
    result = await SlotModel.find({ service: serviceID, date }).populate(
      "service",
    );
  } else if (date) {
    result = await SlotModel.find({ date }).populate("service");
  } else if (serviceID) {
    result = await SlotModel.find({ service: serviceID }).populate("service");
  } else {
    result = await SlotModel.find().populate("service");
  }

  return result;
};

const updateSlotStatusInDB = async (
  id: string,
  isBooked: "available" | "booked" | "canceled",
) => {
  const result = await SlotModel.findByIdAndUpdate(
    id,
    { isBooked },
    { new: true },
  ).populate("service");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot not found");
  }

  return result;
};

export const SlotServices = {
  createSlotIntoDB,
  getSlotsFromDB,
  updateSlotStatusInDB,
};
