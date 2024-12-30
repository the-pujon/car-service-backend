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
exports.TransactionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
// import catchAsync from "../../shared/catchAsync";
// import sendResponse from "../../shared/sendResponse";
const transaction_service_1 = require("./transaction.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync."));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createTransaction = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.createTransaction(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Transaction created successfully",
        data: result
    });
}));
const getAllTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.getAllTransactions();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Transactions retrieved successfully",
        data: result
    });
}));
const getTransactionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.getTransactionById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Transaction retrieved successfully",
        data: result
    });
}));
// const getTransactionsByCustomerId = catchAsync(async (req: Request, res: Response) => {
//   const result = await TransactionService.getTransactionsByCustomerId(req.params.customerId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Customer transactions retrieved successfully",
//     data: result
//   });
// });
const getTransactionsByUserEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    // console.log(userEmail)
    const result = yield transaction_service_1.TransactionService.getTransactionsByUserEmail(userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User transactions retrieved successfully",
        data: result
    });
}));
const getTransactionsByServiceId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.getTransactionsByServiceId(req.params.serviceId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service transactions retrieved successfully",
        data: result
    });
}));
const calculateServiceWiseTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.calculateServiceWiseTransactions();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service-wise transaction calculation retrieved successfully",
        data: result
    });
}));
const calculateDateWiseTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const result = yield transaction_service_1.TransactionService.calculateDateWiseTransactions(startDate, endDate);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Date-wise transaction calculation retrieved successfully",
        data: result
    });
}));
const calculateStatusWiseTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_service_1.TransactionService.calculateStatusWiseTransactions();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Status-wise transaction calculation retrieved successfully",
        data: result
    });
}));
const updateTransactionStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const result = yield transaction_service_1.TransactionService.updateTransactionStatus(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Transaction status updated successfully",
        data: result
    });
}));
exports.TransactionController = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    //   getTransactionsByCustomerId,
    getTransactionsByUserEmail,
    getTransactionsByServiceId,
    calculateServiceWiseTransactions,
    calculateDateWiseTransactions,
    calculateStatusWiseTransactions,
    updateTransactionStatus
};
