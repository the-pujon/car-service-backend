import { Router } from "express";
import { UserController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import {
  LoginValidation,
  SignupValidation,
  UpdateProfileValidation,
  UpdateRoleValidation,
} from "./auth.validation";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/signup",
  validateRequest(SignupValidation),
  UserController.signupUser,
);

router.post(
  "/login",
  validateRequest(LoginValidation),
  UserController.loginUser,
);

router.patch(
  "/update-profile",
  auth("user", "admin"),
  validateRequest(UpdateProfileValidation),
  UserController.updateOwnProfile,
);

router.patch(
  "/update-role/:id",
  auth("admin"),
  validateRequest(UpdateRoleValidation),
  UserController.updateUserRole,
);

router.get("/users", auth("admin"), UserController.getAllUsers);

router.get("/users/:id", auth("admin"), UserController.getSingleUser);

router.get(
  "/users/email/:email",
  auth("admin"),
  UserController.getSingleUserByEmail,
);

export const AuthRoutes = router;
