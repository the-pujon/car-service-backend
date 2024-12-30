import { z } from "zod";

export const ServiceCreateValidation = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    price: z.number(),
    duration: z.number(),
    image: z.string(),
    benefits: z.array(z.string()),
    suitableFor: z.array(z.string()),
  }),
});

export const ServiceUpdateValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    price: z.number().optional(),
    duration: z.number().optional(),
    image: z.string().optional(),
    benefits: z.array(z.string()).optional(),
    suitableFor: z.array(z.string()).optional(),
  }),
});

export const serviceOverviewQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  category: z.string().optional(),
});