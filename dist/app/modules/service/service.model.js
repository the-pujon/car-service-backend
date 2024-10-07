"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModel = void 0;
const mongoose_1 = require("mongoose");
const serviceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    image: { type: String, required: true },
    benefits: { type: [String], required: true },
    suitableFor: { type: [String], required: true },
}, { timestamps: true });
exports.ServiceModel = (0, mongoose_1.model)("Service", serviceSchema);
