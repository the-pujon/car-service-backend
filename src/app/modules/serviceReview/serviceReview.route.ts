import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceReviewValidation } from './serviceReview.validation';
import { ServiceReviewController } from './serviceReview.controller';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
//   auth("user", "admin"),
  validateRequest(ServiceReviewValidation.createServiceReviewValidationSchema),
  ServiceReviewController.createServiceReview,
);

router.get('/', ServiceReviewController.getAllServiceReviews);

router.get('/:id', ServiceReviewController.getSingleServiceReview);

router.patch(
  '/:id',
  auth("user", "admin"),
  validateRequest(ServiceReviewValidation.updateServiceReviewValidationSchema),
  ServiceReviewController.updateServiceReview,
);

router.delete('/:id', auth("admin"), ServiceReviewController.deleteServiceReview);

export const ServiceReviewRoutes = router;
