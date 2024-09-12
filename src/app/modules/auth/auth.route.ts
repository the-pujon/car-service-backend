import { Router } from "express";
import { UserController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { LoginValidation, SignupValidation } from "./auth.validation";

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

export const AuthRoutes = router;
