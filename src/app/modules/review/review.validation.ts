import { z } from "zod";

export const ReviewCreateValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    message: z
      .string({
        required_error: "Message is required",
      })
      .min(10, "Message must be at least 10 characters long"),
    rating: z
      .number({
        required_error: "Rating is required",
      })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),
  }),
});
