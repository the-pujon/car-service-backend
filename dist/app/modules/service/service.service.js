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
exports.CarServiceServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const service_model_1 = require("./service.model");
//create service
const createServiceIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.ServiceModel.create(payLoad);
    return result;
});
//get service
const getServicesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.ServiceModel.find({ isDeleted: false });
    return result;
});
//get single service
const getServiceByIDFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.ServiceModel.findOne({
        _id: id,
    });
    const isServiceDeleted = result === null || result === void 0 ? void 0 : result.isDeleted;
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found");
    }
    if (isServiceDeleted === true) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found. This service already deleted");
    }
    return result;
});
//delete single service
const deleteServiceByIDFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.ServiceModel.findOne({
        _id: id,
    });
    const isServiceDeleted = service === null || service === void 0 ? void 0 : service.isDeleted;
    if (!service) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found");
    }
    if (isServiceDeleted === true) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found. This service already deleted");
    }
    const result = yield service_model_1.ServiceModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
//update service
const updateServiceByIDIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const singleService = yield service_model_1.ServiceModel.findOne({
        _id: id,
    });
    const isServiceDeleted = singleService === null || singleService === void 0 ? void 0 : singleService.isDeleted;
    if (!singleService) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service is not found");
    }
    if (isServiceDeleted === true) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Service couldn't update. This service already deleted");
    }
    const result = yield service_model_1.ServiceModel.findByIdAndUpdate(id, payload, {
        new: true,
    }).exec();
    return result;
});
exports.CarServiceServices = {
    createServiceIntoDB,
    getServicesFromDB,
    getServiceByIDFromDB,
    deleteServiceByIDFromDB,
    updateServiceByIDIntoDB,
};
