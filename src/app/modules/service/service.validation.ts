import { z } from "zod";

export const ServiceCreateValidation = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    price: z.number(),
    duration: z.number(),
    image: z.string(),
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
  }),
});
