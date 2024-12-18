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
exports.ServiceReviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
// import catchAsync from '../../utils/catchAsync';
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const serviceReview_service_1 = require("./serviceReview.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync."));
const createServiceReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield serviceReview_service_1.ServiceReviewService.createServiceReview(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Service review created successfully',
        data: result,
    });
}));
const getAllServiceReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield serviceReview_service_1.ServiceReviewService.getAllServiceReviews();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Service reviews retrieved successfully',
        data: result,
    });
}));
const getServiceReviewsByServiceID = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield serviceReview_service_1.ServiceReviewService.getServiceReviewsByServiceID(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Service review retrieved successfully',
        data: result,
    });
}));
const updateServiceReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield serviceReview_service_1.ServiceReviewService.updateServiceReview(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Service review updated successfully',
        data: result,
    });
}));
const deleteServiceReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield serviceReview_service_1.ServiceReviewService.deleteServiceReview(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Service review deleted successfully',
        data: result,
    });
}));
exports.ServiceReviewController = {
    createServiceReview,
    getAllServiceReviews,
    getServiceReviewsByServiceID,
    updateServiceReview,
    deleteServiceReview,
};
