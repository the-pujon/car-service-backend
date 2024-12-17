import httpStatus from 'http-status';
import { ServiceReviewModel } from './serviceReview.model';
import { ServiceModel } from '../service/service.model';
import { TServiceReview } from './serviceReview.interface';
import AppError from '../../errors/AppError';

const createServiceReview = async (payload: TServiceReview) => {
  const review = await ServiceReviewModel.create(payload);
  
  // Add review id to service's reviews array
  await ServiceModel.findByIdAndUpdate(
    payload.service,
    {
      $push: { reviews: review._id },
    },
    { new: true },
  );

  return review;
};

const getAllServiceReviews = async () => {
  const reviews = await ServiceReviewModel.find({ isDeleted: false })
    .populate('service');
  return reviews;
};

const getSingleServiceReview = async (id: string) => {
  const review = await ServiceReviewModel.findById(id)
    .populate('service');
  
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  return review;
};

const updateServiceReview = async (id: string, payload: Partial<TServiceReview>) => {
  const review = await ServiceReviewModel.findByIdAndUpdate(
    id,
    payload,
    { new: true },
  );

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  return review;
};

const deleteServiceReview = async (id: string) => {
  const session = await ServiceReviewModel.startSession();

  try {
    session.startTransaction();

    const review = await ServiceReviewModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!review) {
      throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
    }

    // Remove review id from service's reviews array
    await ServiceModel.findByIdAndUpdate(
      review.service,
      {
        $pull: { reviews: review._id },
      },
      { session },
    );

    await session.commitTransaction();
    return review;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const ServiceReviewService = {
  createServiceReview,
  getAllServiceReviews,
  getSingleServiceReview,
  updateServiceReview,
  deleteServiceReview,
};
