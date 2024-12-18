"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_route_1 = require("../modules/service/service.route");
const auth_route_1 = require("../modules/auth/auth.route");
const booking_route_1 = require("../modules/booking/booking.route");
const review_route_1 = require("../modules/review/review.route");
const serviceReview_route_1 = require("../modules/serviceReview/serviceReview.route");
const transaction_router_1 = require("../modules/transaction/transaction.router");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/services",
        route: service_route_1.ServiceRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/bookings",
        route: booking_route_1.BookingRoutes,
    },
    {
        path: "/reviews",
        route: review_route_1.ReviewRoutes,
    },
    {
        path: "/service-reviews",
        route: serviceReview_route_1.ServiceReviewRoutes,
    },
    {
        path: "/transactions",
        route: transaction_router_1.TransactionRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
