import { Request, Response } from "express";
import httpStatus from "http-status";
// import catchAsync from "../../shared/catchAsync";
// import sendResponse from "../../shared/sendResponse";
import { TransactionService } from "./transaction.service";
import catchAsync from "../../utils/catchAsync.";
import sendResponse from "../../utils/sendResponse";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.createTransaction(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction created successfully",
    data: result
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getAllTransactions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transactions retrieved successfully",
    data: result
  });
});

const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getTransactionById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction retrieved successfully",
    data: result
  });
});

const getTransactionsByCustomerId = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getTransactionsByCustomerId(req.params.customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer transactions retrieved successfully",
    data: result
  });
});

const getTransactionsByUserEmail = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.user?.email;
  const result = await TransactionService.getTransactionsByUserEmail(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User transactions retrieved successfully",
    data: result
  });
});

const getTransactionsByServiceId = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getTransactionsByServiceId(req.params.serviceId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service transactions retrieved successfully",
    data: result
  });
});

const calculateServiceWiseTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.calculateServiceWiseTransactions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service-wise transaction calculation retrieved successfully",
    data: result
  });
});

const calculateDateWiseTransactions = catchAsync(async (req: Request, res: Response) => {
  const startDate = new Date(req.query.startDate as string);
  const endDate = new Date(req.query.endDate as string);
  
  const result = await TransactionService.calculateDateWiseTransactions(startDate, endDate);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Date-wise transaction calculation retrieved successfully",
    data: result
  });
});

const calculateStatusWiseTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.calculateStatusWiseTransactions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status-wise transaction calculation retrieved successfully",
    data: result
  });
});

const updateTransactionStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const result = await TransactionService.updateTransactionStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transaction status updated successfully",
    data: result
  });
});

export const TransactionController = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByCustomerId,
  getTransactionsByUserEmail,
  getTransactionsByServiceId,
  calculateServiceWiseTransactions,
  calculateDateWiseTransactions,
  calculateStatusWiseTransactions,
  updateTransactionStatus
};
