import httpStatus from 'http-status';
import { ServiceReviewModel } from './serviceReview.model';
import { ServiceModel } from '../service/service.model';
import { TServiceReview } from './serviceReview.interface';
import AppError from '../../errors/AppError';
import { Types } from 'mongoose';

const calculateAverageRating = async (serviceId: string) => {
  // Convert string ID to ObjectId for aggregation
  const objectId = new Types.ObjectId(serviceId);
  
  const result = await ServiceReviewModel.aggregate([
    {
      $match: {
        service: objectId,
        isDeleted: false  // Only consider active reviews
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
};

const createServiceReview = async (payload: TServiceReview) => {
  const session = await ServiceReviewModel.startSession();

  try {
    session.startTransaction();

    // Create the review
    const review = await ServiceReviewModel.create([payload], { session });
    const serviceId = payload.service;
    // Calculate new average rating
    const averageRating = await calculateAverageRating(serviceId.toString());

    // Update service with new review and rating
    await ServiceModel.findByIdAndUpdate(
      serviceId,
      {
        $push: { reviews: review[0]._id },
        $set: { rating: averageRating }
      },
      { session }
    );

    await session.commitTransaction();
    return review[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllServiceReviews = async () => {
  const reviews = await ServiceReviewModel.find({ isDeleted: false })
    // .populate('service');
  return reviews;
};

const getServiceReviewsByServiceID = async (id: string) => {
  const review = await ServiceReviewModel.find({service:id,isDeleted:false})
    // .populate('service');
  
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  return review;
};

const updateServiceReview = async (id: string, payload: Partial<TServiceReview>) => {
  const session = await ServiceReviewModel.startSession();

  try {
    session.startTransaction();

    const review = await ServiceReviewModel.findByIdAndUpdate(
      id,
      payload,
      { new: true, session }
    );

    if (!review) {
      throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
    }

    // Only recalculate if rating was changed
    if (payload.rating) {
      const averageRating = await calculateAverageRating(review.service.toString());
      await ServiceModel.findByIdAndUpdate(
        review.service,
        { rating: averageRating },
        { session }
      );
    }

    await session.commitTransaction();
    return review;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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

    // Recalculate average after soft-deleting the review
    const averageRating = await calculateAverageRating(review.service.toString());

    await ServiceModel.findByIdAndUpdate(
      review.service,
      {
        $pull: { reviews: review._id },
        $set: { rating: averageRating }
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
  getServiceReviewsByServiceID,
  updateServiceReview,
  deleteServiceReview,
};
