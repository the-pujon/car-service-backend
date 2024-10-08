"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slot_model_1 = require("../slot/slot.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const service_model_1 = require("../service/service.model");
const auth_model_1 = require("../auth/auth.model");
const booking_model_1 = require("./booking.model");
const createBookingIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const unavailableSlot = yield slot_model_1.SlotModel.findById(payload.slotId);
    //if slot not found
    if (!unavailableSlot) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slot not found");
    }
    //if slot already booked
    if ((unavailableSlot === null || unavailableSlot === void 0 ? void 0 : unavailableSlot.isBooked) === "booked") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This slot already booked");
    }
    const unavailableService = yield service_model_1.ServiceModel.findById(payload.serviceId);
    //if service not found
    if (!unavailableService) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Service not found");
    }
    //if slot not available for fixed service
    if (!unavailableSlot.service.equals(unavailableService._id)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid slotId. This Slot not available for this service");
    }
    const customerId = yield auth_model_1.UserModel.findOne({ email: userData.email });
    if (!customerId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not found");
    }
    const id = customerId === null || customerId === void 0 ? void 0 : customerId._id;
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
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        yield slot_model_1.SlotModel.findByIdAndUpdate(payload.slotId, {
            isBooked: "booked",
        });
        const result = (yield booking_model_1.BookingModel.create(newBookingBody)).populate([
            "customer",
            "service",
            "slot",
        ]);
        return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getBookingFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.BookingModel.find().populate([
        "customer",
        {
            path: "service",
            match: { isDeleted: { $ne: true } }, // Only populate non-deleted services
        },
        "slot",
    ]);
    //return result;
    return result.filter((booking) => booking.service !== null);
});
const getUserBookingsFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const getCustomer = yield auth_model_1.UserModel.findOne({ email: user.email }, { _id: 1 });
    const result = yield booking_model_1.BookingModel.find({
        customer: getCustomer === null || getCustomer === void 0 ? void 0 : getCustomer._id,
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
});
const getBookingsByCustomerIdFromDB = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.BookingModel.find({ customer: customerId }).populate([
        "customer",
        {
            path: "service",
            match: { isDeleted: { $ne: true } }, // Only populate non-deleted services
        },
        "slot",
    ]);
    return result;
});
exports.BookingService = {
    createBookingIntoDB,
    getBookingFromDB,
    getUserBookingsFromDB,
    getBookingsByCustomerIdFromDB,
};
