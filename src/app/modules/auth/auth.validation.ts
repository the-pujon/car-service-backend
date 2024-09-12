import { z } from "zod";

export const SignupValidation = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string(),
    role: z.enum(["user", "admin"]),
    address: z.string(),
  }),
});

export const LoginValidation = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});
