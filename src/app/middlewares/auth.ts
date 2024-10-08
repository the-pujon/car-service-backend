import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { UserModel } from "../modules/auth/auth.model";

export const auth = (...requiredRoles: ("admin" | "user")[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    //if token can't fount
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized. Login first",
      );
    }

    const decoded = jwt.verify(token, config.jwt_access_secret as string);

    const { email, role } = decoded as JwtPayload;

    const user = await UserModel.isUserExist(email);

    //if user not found
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route",
      );
    }

    req.user = decoded as JwtPayload;

    next();
  });
};
