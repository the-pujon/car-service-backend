"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceReviewModel = void 0;
const mongoose_1 = require("mongoose");
const serviceReviewSchema = new mongoose_1.Schema({
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.ServiceReviewModel = (0, mongoose_1.model)("ServiceReview", serviceReviewSchema);
