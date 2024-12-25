import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.";
import sendResponse from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { noDataFoundResponse } from "../../utils/noDataFoundResponse";

const createBooking = catchAsync(async (req, res) => {
  const result = await BookingService.createBookingIntoDB(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking created successfully",
    data: result,
  });
});

const getBooking = catchAsync(async (req, res) => {
  const result = await BookingService.getBookingFromDB();

  //if there is no data
  noDataFoundResponse(res, result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All bookings retrieved successfully",
    data: result,
  });
});

const getUserBooking = catchAsync(async (req, res) => {
  const result = await BookingService.getUserBookingsFromDB(req.user);

  //if there is no data
  noDataFoundResponse(res, result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User bookings retrieved successfully",
    data: result,
  });
});

const getBookingsByCustomerId = catchAsync(async (req, res) => {
  const { customerId } = req.params;
  const result = await BookingService.getBookingsByCustomerIdFromDB(customerId);

  noDataFoundResponse(res, result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully for the customer",
    data: result,
  });
});

const cancelBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const result = await BookingService.cancelBooking(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking cancelled successfully",
    data: result,
  });
});

export const BookingControllers = {
  createBooking,
  getBooking,
  getUserBooking,
  getBookingsByCustomerId,
  cancelBooking,
};
