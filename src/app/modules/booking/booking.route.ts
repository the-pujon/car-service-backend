import { Router } from "express";
import { BookingControllers } from "./booking.controller";
import validateRequest from "../../middlewares/validateRequest";
import { BookingCreateValidation } from "./booking.validation";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth("user"),
  validateRequest(BookingCreateValidation),
  BookingControllers.createBooking,
);

router.get("/", auth("admin"), BookingControllers.getBooking);

router.get("/my-bookings", auth("user"), BookingControllers.getUserBooking);

router.get(
  "/customer/:customerId",
  auth("admin"),
  BookingControllers.getBookingsByCustomerId,
);

router.delete("/:bookingId", auth("user", "admin"), BookingControllers.cancelBooking);

router.patch("/reschedule", auth("user"), BookingControllers.rescheduleBooking);

export const BookingRoutes = router;
