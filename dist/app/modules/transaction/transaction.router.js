"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const transaction_validation_1 = require("./transaction.validation");
const transaction_controller_1 = require("./transaction.controller");
const auth_1 = require("../../middlewares/auth");
// import { ENUM_USER_ROLE } from '../../../enums/user';
const ENUM_USER_ROLE = {
    ADMIN: 'admin',
    CUSTOMER: 'user'
};
const router = express_1.default.Router();
router.post('/create-transaction', (0, auth_1.auth)(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER), (0, validateRequest_1.default)(transaction_validation_1.TransactionValidation.createTransactionZodSchema), transaction_controller_1.TransactionController.createTransaction);
router.get('/', (0, auth_1.auth)(ENUM_USER_ROLE.ADMIN), transaction_controller_1.TransactionController.getAllTransactions);
router.get('/:id', (0, auth_1.auth)(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER), transaction_controller_1.TransactionController.getTransactionById);
// router.get(
//   '/customer/:customerId',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
//   TransactionController.getTransactionsByCustomerId
// );
router.get('/user-transactions', (0, auth_1.auth)(ENUM_USER_ROLE.CUSTOMER), transaction_controller_1.TransactionController.getTransactionsByUserEmail);
router.get('/service/:serviceId', (0, auth_1.auth)(ENUM_USER_ROLE.ADMIN), transaction_controller_1.TransactionController.getTransactionsByServiceId);
router.get('/calculate/service-wise', (0, auth_1.auth)(ENUM_USER_ROLE.ADMIN), transaction_controller_1.TransactionController.calculateServiceWiseTransactions);
router.get('/calculate/date-wise', (0, auth_1.auth)(ENUM_USER_ROLE.ADMIN), transaction_controller_1.TransactionController.calculateDateWiseTransactions);
router.get('/calculate/status-wise', (0, auth_1.auth)(ENUM_USER_ROLE.ADMIN), transaction_controller_1.TransactionController.calculateStatusWiseTransactions);
router.patch('/:id/status', (0, auth_1.auth)(ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(transaction_validation_1.TransactionValidation.updateTransactionStatusZodSchema), transaction_controller_1.TransactionController.updateTransactionStatus);
exports.TransactionRoutes = router;
