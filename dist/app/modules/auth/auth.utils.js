"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitPassword = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//creating token
const createToken = (jwtPayload, secret, expireIn) => {
    return jsonwebtoken_1.default.sign(jwtPayload, secret, { expiresIn: expireIn });
};
exports.createToken = createToken;
//omitting password from user
const omitPassword = (user) => {
    const plainUser = JSON.parse(JSON.stringify(user));
    delete plainUser.password;
    delete plainUser.__v;
    return plainUser;
};
exports.omitPassword = omitPassword;
