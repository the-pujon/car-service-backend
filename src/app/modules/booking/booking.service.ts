import { JwtPayload } from "jsonwebtoken";
import { TBookingPayload } from "./booking.interface";
import mongoose, { Types } from "mongoose";
import { SlotModel } from "../slot/slot.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ServiceModel } from "../service/service.model";
import { UserModel } from "../auth/auth.model";
import { BookingModel } from "./booking.model";

const createBookingIntoDB = async (
  userData: JwtPayload,
  payload: TBookingPayload,
) => {
  const unavailableSlot = await SlotModel.findById(payload.slotId);

  //if slot not found
  if (!unavailableSlot) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slot not found");
  }

  //if slot already booked
  if (unavailableSlot?.isBooked === "booked") {
    throw new AppError(httpStatus.BAD_REQUEST, "This slot already booked");
  }

  const unavailableService = await ServiceModel.findById(payload.serviceId);

  //if service not found
  if (!unavailableService) {
    throw new AppError(httpStatus.BAD_REQUEST, "Service not found");
  }

  //if slot not available for fixed service
  if (!unavailableSlot.service.equals(unavailableService._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid slotId. This Slot not available for this service",
    );
  }

  const customerId = await UserModel.findOne({ email: userData.email });

  if (!customerId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  const id = customerId?._id as Types.ObjectId;

  payload.customerId = id;

  const newBookingBody = {
    customer: id,
    service: payload.serviceId,
    slot: payload.slotId,
    vehicleType: payload.vehicleType,
    vehicleBrand: payload.vehicleModel,
    vehicleModel: payload.vehicleModel,
    manufacturingYear: payload.manufacturingYear,
    registrationPlate: payload.registrationPlate,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await SlotModel.findByIdAndUpdate(payload.slotId, {
      isBooked: "booked",
    });

    const result = (await BookingModel.create(newBookingBody)).populate([
      "customer",
      "service",
      "slot",
    ]);

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const cancelBooking = async (bookingId: string) => {
  const booking = await BookingModel.findById(bookingId);

  if (!booking) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not found");
  }

  await SlotModel.findByIdAndUpdate(booking.slot, {
    isBooked: "available",
  });

  await BookingModel.findByIdAndDelete(bookingId);

  return booking;
};

const reScheduleBooking = async (bookingId: string, newSlotId: string) => {
  const booking = await BookingModel.findById(bookingId);

  if (!booking) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not found");
  }

  const newSlot = await SlotModel.findById(newSlotId);

  if (!newSlot) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slot not found");
  }

  const session = await mongoose.startSession();

  try{
    session.startTransaction();

    await SlotModel.findByIdAndUpdate(booking.slot, {
      isBooked: "available",
    });

    await SlotModel.findByIdAndUpdate(newSlotId, {
      isBooked: "booked",
    });

    const result = await BookingModel.findByIdAndUpdate(bookingId, {
      slot: newSlotId,
    });

    return result;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(err:any){
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
}

const getBookingFromDB = async () => {
  const result = await BookingModel.find().populate([
    "customer",
    {
      path: "service",
      match: { isDeleted: { $ne: true } }, // Only populate non-deleted services
    },
    "slot",
  ]);

  //return result;
  return result.filter((booking) => booking.service !== null);
};

const getUserBookingsFromDB = async (user: JwtPayload) => {
  const getCustomer = await UserModel.findOne(
    { email: user.email },
    { _id: 1 },
  );

  const result = await BookingModel.find({
    customer: getCustomer?._id,
  }).populate([
    "customer",
    {
      path: "service",
      match: { isDeleted: { $ne: true } }, // Only populate non-deleted services
    },
    "slot",
  ]);

  //return result;
  return result.filter((booking) => booking.service !== null);
};

const getBookingsByCustomerIdFromDB = async (customerId: string) => {
  const result = await BookingModel.find({ customer: customerId }).populate([
    "customer",
    {
      path: "service",
      match: { isDeleted: { $ne: true } }, // Only populate non-deleted services
    },
    "slot",
  ]);

  //return result;
  return result.filter((booking) => booking.service !== null);
};

export const BookingService = {
  createBookingIntoDB,
  getBookingFromDB,
  getUserBookingsFromDB,
  getBookingsByCustomerIdFromDB,
  reScheduleBooking,
  cancelBooking,
};
