"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_model_1 = require("./auth.model");
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const signupUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield auth_model_1.UserModel.findOne({ email: payload.email });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exist. Please use deferent email");
    }
    const result = yield auth_model_1.UserModel.create(payload);
    return result;
});
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.isUserExist(payload.email);
    //if user not found
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
    //if password is not correct
    if (!auth_model_1.UserModel.isPasswordMatch(payload.password, (yield user).password)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is not correct !");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const token = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, "10h");
    const loggedUserWithoutPassword = (0, auth_utils_1.omitPassword)(user);
    return { token, user: loggedUserWithoutPassword };
});
exports.UserService = {
    signupUserIntoDB,
    loginUserService,
};
