import { JwtPayload } from "jsonwebtoken";
import { TReviewPayload } from "./review.interface";
import { UserModel } from "../auth/auth.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ReviewModel } from "./review.model";

const createReviewIntoDB = async (
  userData: JwtPayload,
  payload: TReviewPayload,
) => {
  const user = await UserModel.findOne({ email: userData.email });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  const newReviewBody = {
    user: user._id,
    ...payload,
  };

  const result = await ReviewModel.create(newReviewBody);
  return result;
};

const getAllReviewsFromDB = async () => {
  const result = await ReviewModel.find();
  return result;
};

const getUserReviewsFromDB = async (user: JwtPayload) => {
  const getUser = await UserModel.findOne({ email: user.email }, { _id: 1 });

  const result = await ReviewModel.find({ user: getUser?._id });
  return result;
};

export const ReviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getUserReviewsFromDB,
};
