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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const transaction_model_1 = require("./transaction.model");
const createTransaction = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.TransactionModel.create(payload);
    return result;
});
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.TransactionModel.find()
        .populate('customer')
        .populate('service');
    return result;
});
const getTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.TransactionModel.findById(id)
        .populate('customer')
        .populate('service');
    return result;
});
// const getTransactionsByCustomerId = async (customerId: string) => {
//   const result = await TransactionModel.find({ customer: customerId })
//     .populate('customer')
//     .populate('service');
//   return result;
// };
const getTransactionsByUserEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.TransactionModel.find({ customer: email })
        .populate('service')
        .exec();
    return result.filter(item => item.customer !== null);
});
const getTransactionsByServiceId = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.TransactionModel.find({ service: serviceId })
        // .populate('customer')
        .populate('service');
    return result;
});
const calculateServiceWiseTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.TransactionModel.aggregate([
        {
            $group: {
                _id: '$service',
                totalTransactions: { $count: {} },
                totalAmount: {
                    $sum: { $toDouble: '$amount' }
                }
            }
        },
        {
            $lookup: {
                from: 'services',
                localField: '_id',
                foreignField: '_id',
                as: 'service'
            }
        },
        {
            $unwind: '$service'
        }
    ]);
    return result;
});
const calculateDateWiseTransactions = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.TransactionModel.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                totalTransactions: { $count: {} },
                totalAmount: {
                    $sum: { $toDouble: '$amount' }
                }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    return result;
});
const calculateStatusWiseTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.TransactionModel.aggregate([
        {
            $group: {
                _id: '$status',
                totalTransactions: { $count: {} },
                totalAmount: {
                    $sum: { $toDouble: '$amount' }
                }
            }
        }
    ]);
    return result;
});
const updateTransactionStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_model_1.TransactionModel.findByIdAndUpdate(id, { status }, { new: true })
        .populate('customer')
        .populate('service');
    return result;
});
exports.TransactionService = {
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
