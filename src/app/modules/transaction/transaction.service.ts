import { TTransaction } from "./transaction.interface";
import { TransactionModel } from "./transaction.model";

const createTransaction = async (payload: TTransaction) => {
  const result = await TransactionModel.create(payload);
  return result;
};

const getAllTransactions = async () => {
  const result = await TransactionModel.find()
    .populate('customer')
    .populate('service');
  return result;
};

const getTransactionById = async (id: string) => {
  const result = await TransactionModel.findById(id)
    .populate('customer')
    .populate('service');
  return result;
};

const getTransactionsByCustomerId = async (customerId: string) => {
  const result = await TransactionModel.find({ customer: customerId })
    .populate('customer')
    .populate('service');
  return result;
};

const getTransactionsByUserEmail = async (email: string) => {
  const result = await TransactionModel.find()
    .populate({
      path: 'customer',
      match: { email: email }
    })
    .populate('service')
    .exec();
  
  return result.filter(item => item.customer !== null);
};

const getTransactionsByServiceId = async (serviceId: string) => {
  const result = await TransactionModel.find({ service: serviceId })
    .populate('customer')
    .populate('service');
  return result;
};

const calculateServiceWiseTransactions = async () => {
  const result = await TransactionModel.aggregate([
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
};

const calculateDateWiseTransactions = async (startDate: Date, endDate: Date) => {
  const result = await TransactionModel.aggregate([
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
};

const calculateStatusWiseTransactions = async () => {
  const result = await TransactionModel.aggregate([
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
};

const updateTransactionStatus = async (id: string, status: string) => {
  const result = await TransactionModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
    .populate('customer')
    .populate('service');
  return result;
};

export const TransactionService = {
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
