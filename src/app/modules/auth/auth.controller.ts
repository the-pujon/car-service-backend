import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./auth.service";

const signupUser = catchAsync(async (req, res) => {
  const result = await UserService.signupUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { token, user } = await UserService.loginUserService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    token: token,
    data: user,
  });
});

const updateOwnProfile = catchAsync(async (req, res) => {
  // console.log("updateOwnProfile", req.body);

  const result = await UserService.updateOwnProfile(req.user.email, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const result = await UserService.updateUserRole(
    req.params.id,
    req.body.role,
    req.user.email,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User role updated successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await UserService.getSingleUser(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const getSingleUserByEmail = catchAsync(async (req, res) => {
  const result = await UserService.getSingleUserByEmail(req.params.email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await UserService.changePassword(req.user.email, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

export const UserController = {
  signupUser,
  loginUser,
  updateOwnProfile,
  updateUserRole,
  getAllUsers,
  getSingleUser,
  getSingleUserByEmail,
  changePassword,
};
