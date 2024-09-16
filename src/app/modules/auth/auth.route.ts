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
  auth("user"),
  validateRequest(UpdateProfileValidation),
  UserController.updateProfile,
);

router.patch(
  "/update-role/:id",
  auth("admin"),
  validateRequest(UpdateRoleValidation),
  UserController.updateRole,
);

router.get(
  "/users",
  //auth("admin"),
  UserController.getAllUsers,
);

router.get(
  "/users/:id",
  //auth("admin"),
  UserController.getSingleUser,
);

export const AuthRoutes = router;
