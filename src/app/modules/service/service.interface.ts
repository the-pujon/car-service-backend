import { Types } from "mongoose";

export type TService = {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  isDeleted: boolean;
  image: string;
  benefits: string[];
  suitableFor: string[];
  reviews?: Types.ObjectId[];
  rating?: number;
};
