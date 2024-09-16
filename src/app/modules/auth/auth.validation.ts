import { z } from "zod";

export const SignupValidation = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string(),
    role: z.enum(["user", "admin"]).optional(),
    address: z.string(),
  }),
});

export const LoginValidation = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const UpdateProfileValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const UpdateRoleValidation = z.object({
  body: z.object({
    role: z.enum(["user", "admin"]),
  }),
});
