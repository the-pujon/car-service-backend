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
exports.SlotControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync."));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const slot_service_1 = require("./slot.service");
const noDataFoundResponse_1 = require("../../utils/noDataFoundResponse");
const createSlotController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_service_1.SlotServices.createSlotIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Slots created successfully",
        data: result,
    });
}));
const getSlotController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, serviceId } = req.query;
    const result = yield slot_service_1.SlotServices.getSlotsFromDB(date, serviceId);
    //if there is no data
    if (result.length === 0) {
        (0, noDataFoundResponse_1.noDataFoundResponse)(res, result);
    }
    else {
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Available slots retrieved successfully",
            data: result,
        });
    }
}));
const updateSlotStatusController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { isBooked } = req.body;
    const result = yield slot_service_1.SlotServices.updateSlotStatusInDB(id, isBooked);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Slot status updated successfully",
        data: result,
    });
}));
const getSlotByIdController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield slot_service_1.SlotServices.getSlotByIdFromDB(id);
    if (!result) {
        (0, noDataFoundResponse_1.noDataFoundResponse)(res, result);
    }
    else {
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Slot retrieved successfully",
            data: result,
        });
    }
}));
exports.SlotControllers = {
    createSlotController,
    getSlotController,
    updateSlotStatusController,
    getSlotByIdController,
};
