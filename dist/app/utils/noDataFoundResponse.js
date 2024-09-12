"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noDataFoundResponse = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("./sendResponse"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noDataFoundResponse = (res, result) => {
    if (result.length === 0 || !result) {
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.NOT_FOUND,
            message: "No Data Found",
            data: result,
        });
    }
};
exports.noDataFoundResponse = noDataFoundResponse;
