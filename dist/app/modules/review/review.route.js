"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_validation_1 = require("./review.validation");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/", 
// auth("user", "admin"),
(0, validateRequest_1.default)(review_validation_1.ReviewCreateValidation), review_controller_1.ReviewControllers.createReview);
router.get("/", review_controller_1.ReviewControllers.getAllReviews);
router.get("/my-reviews", (0, auth_1.auth)("user"), review_controller_1.ReviewControllers.getUserReviews);
exports.ReviewRoutes = router;
