import { Request, Response } from 'express';
import httpStatus from 'http-status';
// import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ServiceReviewService } from './serviceReview.service';
import catchAsync from '../../utils/catchAsync.';

const createServiceReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceReviewService.createServiceReview(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Service review created successfully',
    data: result,
  });
});

const getAllServiceReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceReviewService.getAllServiceReviews();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service reviews retrieved successfully',
    data: result,
  });
});

const getSingleServiceReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceReviewService.getSingleServiceReview(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service review retrieved successfully',
    data: result,
  });
});

const updateServiceReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceReviewService.updateServiceReview(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service review updated successfully',
    data: result,
  });
});

const deleteServiceReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceReviewService.deleteServiceReview(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service review deleted successfully',
    data: result,
  });
});

export const ServiceReviewController = {
  createServiceReview,
  getAllServiceReviews,
  getSingleServiceReview,
  updateServiceReview,
  deleteServiceReview,
};
