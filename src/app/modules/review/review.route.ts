import { Router } from "express";
import { ReviewControllers } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewCreateValidation } from "./review.validation";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth("user", "admin"),
  validateRequest(ReviewCreateValidation),
  ReviewControllers.createReview,
);

router.get("/", ReviewControllers.getAllReviews);

router.get("/my-reviews", auth("user"), ReviewControllers.getUserReviews);

export const ReviewRoutes = router;
