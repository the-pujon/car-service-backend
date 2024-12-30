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
exports.ServiceControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync."));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const service_service_1 = require("./service.service");
const noDataFoundResponse_1 = require("../../utils/noDataFoundResponse");
const service_validation_1 = require("./service.validation");
//create service controller
const createService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_service_1.CarServiceServices.createServiceIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service created successfully",
        data: result,
    });
}));
//get service controller
const getService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search = '', category = '', sortBy = '' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const result = yield service_service_1.CarServiceServices.getServicesFromDB(page, search, category, sortBy);
    //if there is no data
    if (!result) {
        (0, noDataFoundResponse_1.noDataFoundResponse)(res, result);
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Services retrieve successfully",
            data: result,
        });
    }
}));
//get single service controller
const getServiceById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_service_1.CarServiceServices.getServiceByIDFromDB(req.params.id);
    //if there is no data
    // noDataFoundResponse(res, result);
    if (!result) {
        (0, noDataFoundResponse_1.noDataFoundResponse)(res, result);
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Service retrieve successfully",
            data: result,
        });
    }
}));
//delete single service controller
const deleteServiceByID = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_service_1.CarServiceServices.deleteServiceByIDFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service deleted successfully",
        data: result,
    });
}));
//update service controller
const updateServiceByID = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_service_1.CarServiceServices.updateServiceByIDIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service updated successfully",
        data: result,
    });
}));
const getServiceOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate and transform query parameters
    const validatedQuery = service_validation_1.serviceOverviewQuerySchema.parse(req.query);
    const result = yield service_service_1.CarServiceServices.getServiceOverviewFromDB({
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        search: validatedQuery.search,
        category: validatedQuery.category,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Service overview retrieved successfully",
        data: result,
    });
}));
//exporting all controllers
exports.ServiceControllers = {
    createService,
    getService,
    getServiceById,
    deleteServiceByID,
    updateServiceByID,
    getServiceOverview
};
