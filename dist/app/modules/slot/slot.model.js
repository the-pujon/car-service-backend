"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotModel = void 0;
const mongoose_1 = require("mongoose");
const SlotSchema = new mongoose_1.Schema({
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Service",
    },
    date: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    isBooked: {
        type: String,
        enum: ["available", "booked", "canceled"],
        default: "available",
    },
});
exports.SlotModel = (0, mongoose_1.model)("Slot", SlotSchema);
