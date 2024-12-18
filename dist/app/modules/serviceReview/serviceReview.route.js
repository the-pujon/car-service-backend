"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const serviceReview_validation_1 = require("./serviceReview.validation");
const serviceReview_controller_1 = require("./serviceReview.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post('/', 
//   auth("user", "admin"),
(0, validateRequest_1.default)(serviceReview_validation_1.ServiceReviewValidation.createServiceReviewValidationSchema), serviceReview_controller_1.ServiceReviewController.createServiceReview);
router.get('/', serviceReview_controller_1.ServiceReviewController.getAllServiceReviews);
router.get('/:id', serviceReview_controller_1.ServiceReviewController.getServiceReviewsByServiceID);
router.patch('/:id', (0, auth_1.auth)("user", "admin"), (0, validateRequest_1.default)(serviceReview_validation_1.ServiceReviewValidation.updateServiceReviewValidationSchema), serviceReview_controller_1.ServiceReviewController.updateServiceReview);
router.delete('/:id', (0, auth_1.auth)("admin"), serviceReview_controller_1.ServiceReviewController.deleteServiceReview);
exports.ServiceReviewRoutes = router;
