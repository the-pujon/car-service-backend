"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFoundRouteHandler_1 = __importDefault(require("./app/middlewares/notFoundRouteHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.status(http_status_1.default.OK).json({
        status: "success",
        message: "Welcome to car washing service api",
    });
});
app.post("/api/booking-success", (req, res) => {
    // console.log(req);
    res.redirect(302, `${process.env.FRONTEND_URL}/booking-success`);
});
// console.log(process.env.FRONTEND_URL);
app.post("/api/booking-failed", express_1.default.json(), (req, res) => {
    res.redirect(302, `${process.env.FRONTEND_URL}/booking-fail`);
});
app.use(notFoundRouteHandler_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
