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
exports.ServiceReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const serviceReview_model_1 = require("./serviceReview.model");
const service_model_1 = require("../service/service.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const mongoose_1 = require("mongoose");
const calculateAverageRating = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert string ID to ObjectId for aggregation
    const objectId = new mongoose_1.Types.ObjectId(serviceId);
    const result = yield serviceReview_model_1.ServiceReviewModel.aggregate([
        {
            $match: {
                service: objectId,
                isDeleted: false // Only consider active reviews
            }
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" }
            }
        }
    ]);
    const averageRating = result.length > 0 ? Number(result[0].averageRating.toFixed(1)) : 0;
    return averageRating;
});
const createServiceReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield serviceReview_model_1.ServiceReviewModel.startSession();
    try {
        session.startTransaction();
        // Create the review
        const review = yield serviceReview_model_1.ServiceReviewModel.create([payload], { session });
        const serviceId = payload.service;
        // Calculate new average rating
        const averageRating = yield calculateAverageRating(serviceId.toString());
        // Update service with new review and rating
        yield service_model_1.ServiceModel.findByIdAndUpdate(serviceId, {
            $push: { reviews: review[0]._id },
            $set: { rating: averageRating }
        }, { session });
        yield session.commitTransaction();
        return review[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getAllServiceReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield serviceReview_model_1.ServiceReviewModel.find({ isDeleted: false });
    // .populate('service');
    return reviews;
});
const getServiceReviewsByServiceID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield serviceReview_model_1.ServiceReviewModel.find({ service: id, isDeleted: false });
    // .populate('service');
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    return review;
});
const updateServiceReview = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield serviceReview_model_1.ServiceReviewModel.startSession();
    try {
        session.startTransaction();
        const review = yield serviceReview_model_1.ServiceReviewModel.findByIdAndUpdate(id, payload, { new: true, session });
        if (!review) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
        }
        // Only recalculate if rating was changed
        if (payload.rating) {
            const averageRating = yield calculateAverageRating(review.service.toString());
            yield service_model_1.ServiceModel.findByIdAndUpdate(review.service, { rating: averageRating }, { session });
        }
        yield session.commitTransaction();
        return review;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const deleteServiceReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield serviceReview_model_1.ServiceReviewModel.startSession();
    try {
        session.startTransaction();
        const review = yield serviceReview_model_1.ServiceReviewModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!review) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
        }
        // Recalculate average after soft-deleting the review
        const averageRating = yield calculateAverageRating(review.service.toString());
        yield service_model_1.ServiceModel.findByIdAndUpdate(review.service, {
            $pull: { reviews: review._id },
            $set: { rating: averageRating }
        }, { session });
        yield session.commitTransaction();
        return review;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.ServiceReviewService = {
    createServiceReview,
    getAllServiceReviews,
    getServiceReviewsByServiceID,
    updateServiceReview,
    deleteServiceReview,
};
