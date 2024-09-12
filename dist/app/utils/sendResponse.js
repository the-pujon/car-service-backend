"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responsePayload = {
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
    };
    if (data.token) {
        responsePayload.token = data.token;
    }
    res.status(data.statusCode).json(responsePayload);
};
exports.default = sendResponse;
