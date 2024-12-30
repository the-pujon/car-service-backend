import { Types } from "mongoose";

export type TService = {
  _id?: Types.ObjectId;
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


export interface ServiceMetrics {
  name: string;
  category: string;
  bookingPercentage: string;
  revenuePercentage: string;
  revenue: number;
  bookings: number;
  isDeleted: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}

export interface MongooseQueryFilters {
  name?: { $regex: string; $options: string };
  category?: string;
}

export interface ServiceOverview {
  servicesWithMetrics: ServiceMetrics[];
  totalActiveServices: number;
  totalDeletedServices: number;
  totalRevenue: number;
  totalBookings: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}