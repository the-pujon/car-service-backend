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
exports.ReviewService = void 0;
const auth_model_1 = require("../auth/auth.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const review_model_1 = require("./review.model");
const createReviewIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ email: userData.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not found");
    }
    const newReviewBody = Object.assign({ user: user._id }, payload);
    const result = yield review_model_1.ReviewModel.create(newReviewBody);
    return result;
});
const getAllReviewsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.ReviewModel.find();
    return result;
});
const getUserReviewsFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const getUser = yield auth_model_1.UserModel.findOne({ email: user.email }, { _id: 1 });
    const result = yield review_model_1.ReviewModel.find({ user: getUser === null || getUser === void 0 ? void 0 : getUser._id });
    return result;
});
exports.ReviewService = {
    createReviewIntoDB,
    getAllReviewsFromDB,
    getUserReviewsFromDB,
};
