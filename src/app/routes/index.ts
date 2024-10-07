import { Router } from "express";
import { ServiceRoutes } from "../modules/service/service.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { ReviewRoutes } from "../modules/review/review.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/services",
    route: ServiceRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/bookings",
    route: BookingRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
