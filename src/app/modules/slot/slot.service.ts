import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { ServiceModel } from "../service/service.model";
import { TSlot } from "./slot.interface";
import { SlotModel } from "./slot.model";
import { SlotUtils } from "./slot.utils";

const createSlotIntoDB = async (payload: TSlot) => {
  const { date, endTime, startTime, service } = payload;

  const startTimeInMin = SlotUtils.timeToMinute(startTime);
  let endTimeInMin = SlotUtils.timeToMinute(endTime);
  const totalMinutesInDay = 24 * 60;

  // Handle case where end time is on the next day
  if (endTimeInMin <= startTimeInMin) {
    endTimeInMin += totalMinutesInDay;
  }

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
  const initialDate = new Date(date);

  for (let time = startTimeInMin; time < endTimeInMin; time += duration) {
    const dayOffset = Math.floor(time / totalMinutesInDay);
    const currentTimeInMin = time % totalMinutesInDay;
    const slotStartTime = SlotUtils.minuteToTime(currentTimeInMin);
    const slotEndTime = SlotUtils.minuteToTime(
      (currentTimeInMin + duration) % totalMinutesInDay,
    );

    const slotDate = new Date(initialDate);
    slotDate.setDate(slotDate.getDate() + dayOffset);

    const slotData = {
      service,
      date: slotDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      startTime: slotStartTime,
      endTime: slotEndTime,
    };

    const createdSlot = await SlotModel.create(slotData);
    Slots.push(createdSlot);
  }

  return Slots;
};

//getting slots
const getSlotsFromDB = async (date: string, serviceID: string) => {
  const query: { date?: string; service?: string } = {};

  query.date = date;
  query.service = serviceID;

  let result;

  if (date && serviceID) {
    result = await SlotModel.find(query).populate({
      path: "service",
      match: { isDeleted: { $ne: true } },
    });
  } else {
    result = await SlotModel.find().populate({
      path: "service",
      match: { isDeleted: { $ne: true } },
    });
  }

  // result.map((slot) => {
  //   console.log(slot.service === null);
  //   if (slot.service === null) {
  //     console.log(slot);
  //   }
  // });

  // Filter out slots with deleted services
  return result.filter((slot) => slot.service !== null);
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

const getSlotByIdFromDB = async (id: string) => {
  const result = await SlotModel.findById(id).populate("service");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot not found");
  }
  return result;
};

export const SlotServices = {
  createSlotIntoDB,
  getSlotsFromDB,
  updateSlotStatusInDB,
  getSlotByIdFromDB,
};
