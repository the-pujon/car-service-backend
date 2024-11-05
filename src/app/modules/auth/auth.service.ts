import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./auth.interface";
import { UserModel } from "./auth.model";
import { JwtPayload } from "jsonwebtoken";
import { createToken, omitPassword } from "./auth.utils";
import config from "../../config";
import { TUpdateUser } from "./auth.interface";

const signupUserIntoDB = async (payload: TUser) => {
  const existingUser = await UserModel.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User already exist. Please use deferent email",
    );
  }

  const result = await UserModel.create(payload);

  return result;
};

const loginUserService = async (payload: JwtPayload) => {
  const user = await UserModel.isUserExist(payload.email);

  //if user not found
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  //if password is not correct
  if (!UserModel.isPasswordMatch(payload.password, (await user).password)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is not correct !");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role as string,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10h",
  );

  const loggedUserWithoutPassword = omitPassword(user);

  return { token, user: loggedUserWithoutPassword };
};

const updateOwnProfile = async (userEmail: string, payload: TUpdateUser) => {
  const user = await UserModel.findOne({ email: userEmail });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Ensure email and role cannot be updated
  delete payload.email;
  delete payload.role;

  const result = await UserModel.findOneAndUpdate(
    { email: userEmail },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  return omitPassword(result!);
};

const updateUserRole = async (
  userId: string,
  newRole: string,
  adminEmail: string,
) => {
  const user = await UserModel.findById(userId);
  const admin = await UserModel.findOne({ email: adminEmail });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!admin || admin.role !== "admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only admins can update user roles",
    );
  }

  if (user.email === adminEmail) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Admins cannot change their own role",
    );
  }

  const result = await UserModel.findByIdAndUpdate(
    userId,
    { role: newRole },
    {
      new: true,
      runValidators: true,
    },
  );

  return { _id: result!._id, role: result!.role };
};

const getAllUsers = async () => {
  const users = await UserModel.find({}, "-password");
  return users;
};

const getSingleUser = async (userId: string) => {
  const user = await UserModel.findById(userId, "-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const getSingleUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email }, "-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const changePassword = async (email: string, payload: JwtPayload) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await UserModel.findByIdAndUpdate(
    user._id,
    { password: payload.password },
    { new: true, runValidators: true },
  );
  return result;
};

export const UserService = {
  signupUserIntoDB,
  loginUserService,
  updateOwnProfile,
  updateUserRole,
  getAllUsers,
  getSingleUser,
  getSingleUserByEmail,
  changePassword,
};
