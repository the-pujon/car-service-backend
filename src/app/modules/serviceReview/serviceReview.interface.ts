import { Types } from "mongoose";

export type TServiceReview = {
  rating: number;
  review: string;
  service: Types.ObjectId;
  user: string;
  name: string;
  isDeleted: boolean;
};
