import { z } from 'zod';

const createServiceReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    review: z.string().min(1),
    service: z.string(),
    user: z.string(),
    name: z.string(),
  }),
});

const updateServiceReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    review: z.string().min(1).optional(),
  }),
});

export const ServiceReviewValidation = {
  createServiceReviewValidationSchema,
  updateServiceReviewValidationSchema,
};
