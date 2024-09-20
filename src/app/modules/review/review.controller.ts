import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";
import { noDataFoundResponse } from "../../utils/noDataFoundResponse";

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewService.createReviewIntoDB(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllReviewsFromDB();

  noDataFoundResponse(res, result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All reviews retrieved successfully",
    data: result,
  });
});

const getUserReviews = catchAsync(async (req, res) => {
  const result = await ReviewService.getUserReviewsFromDB(req.user);

  noDataFoundResponse(res, result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User reviews retrieved successfully",
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getAllReviews,
  getUserReviews,
};
