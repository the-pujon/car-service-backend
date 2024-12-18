import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { TransactionValidation } from './transaction.validation';
import { TransactionController } from './transaction.controller';
import {auth} from '../../middlewares/auth';
// import { ENUM_USER_ROLE } from '../../../enums/user';

const ENUM_USER_ROLE: {
    ADMIN: 'admin',
    CUSTOMER: 'user'
} = {
    ADMIN: 'admin',
    CUSTOMER: 'user'
}

const router = express.Router();

router.post(
  '/create-transaction',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  validateRequest(TransactionValidation.createTransactionZodSchema),
  TransactionController.createTransaction
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  TransactionController.getAllTransactions
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  TransactionController.getTransactionById
);

// router.get(
//   '/customer/:customerId',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
//   TransactionController.getTransactionsByCustomerId
// );

router.get(
  '/user/my-transactions',
  auth("user"),
  TransactionController.getTransactionsByUserEmail
);

router.get(
  '/service/:serviceId',
  auth(ENUM_USER_ROLE.ADMIN),
  TransactionController.getTransactionsByServiceId
);

router.get(
  '/calculate/service-wise',
  auth(ENUM_USER_ROLE.ADMIN),
  TransactionController.calculateServiceWiseTransactions
);

router.get(
  '/calculate/date-wise',
  auth(ENUM_USER_ROLE.ADMIN),
  TransactionController.calculateDateWiseTransactions
);

router.get(
  '/calculate/status-wise',
  auth(ENUM_USER_ROLE.ADMIN),
  TransactionController.calculateStatusWiseTransactions
);

router.patch(
  '/:id/status',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(TransactionValidation.updateTransactionStatusZodSchema),
  TransactionController.updateTransactionStatus
);

export const TransactionRoutes = router;
