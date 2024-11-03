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
exports.SlotServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const service_model_1 = require("../service/service.model");
const slot_model_1 = require("./slot.model");
const slot_utils_1 = require("./slot.utils");
const createSlotIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, endTime, startTime, service } = payload;
    const startTimeInMin = slot_utils_1.SlotUtils.timeToMinute(startTime);
    let endTimeInMin = slot_utils_1.SlotUtils.timeToMinute(endTime);
    const totalMinutesInDay = 24 * 60;
    // Handle case where end time is on the next day
    if (endTimeInMin <= startTimeInMin) {
        endTimeInMin += totalMinutesInDay;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getDuration = yield service_model_1.ServiceModel.findById(service).select({
        duration: 1,
        _id: 0,
    });
    const duration = (getDuration === null || getDuration === void 0 ? void 0 : getDuration.duration) || 60;
    //if service id is invalid then throw error
    if (!getDuration) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid service id");
    }
    const existingSlot = yield slot_model_1.SlotModel.find({
        service,
        date,
        startTime: { $gte: startTime, $lt: endTime },
    });
    //throw error if slot overlap
    if (existingSlot.length > 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Slot already exists");
    }
    const Slots = [];
    const initialDate = new Date(date);
    for (let time = startTimeInMin; time < endTimeInMin; time += duration) {
        const dayOffset = Math.floor(time / totalMinutesInDay);
        const currentTimeInMin = time % totalMinutesInDay;
        const slotStartTime = slot_utils_1.SlotUtils.minuteToTime(currentTimeInMin);
        const slotEndTime = slot_utils_1.SlotUtils.minuteToTime((currentTimeInMin + duration) % totalMinutesInDay);
        const slotDate = new Date(initialDate);
        slotDate.setDate(slotDate.getDate() + dayOffset);
        const slotData = {
            service,
            date: slotDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
            startTime: slotStartTime,
            endTime: slotEndTime,
        };
        const createdSlot = yield slot_model_1.SlotModel.create(slotData);
        Slots.push(createdSlot);
    }
    return Slots;
});
//getting slots
const getSlotsFromDB = (date, serviceID) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    query.date = date;
    query.service = serviceID;
    let result;
    if (date && serviceID) {
        result = yield slot_model_1.SlotModel.find(query).populate({
            path: "service",
            match: { isDeleted: { $ne: true } },
        });
    }
    else {
        result = yield slot_model_1.SlotModel.find().populate({
            path: "service",
            match: { isDeleted: { $ne: true } },
        });
    }
    result.map((slot) => {
        console.log(slot.service === null);
        if (slot.service === null) {
            console.log(slot);
        }
    });
    // Filter out slots with deleted services
    return result.filter((slot) => slot.service !== null);
});
const updateSlotStatusInDB = (id, isBooked) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.SlotModel.findByIdAndUpdate(id, { isBooked }, { new: true }).populate("service");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Slot not found");
    }
    return result;
});
const getSlotByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.SlotModel.findById(id).populate("service");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Slot not found");
    }
    return result;
});
exports.SlotServices = {
    createSlotIntoDB,
    getSlotsFromDB,
    updateSlotStatusInDB,
    getSlotByIdFromDB,
};
