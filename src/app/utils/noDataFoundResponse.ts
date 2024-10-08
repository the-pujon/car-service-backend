import httpStatus from "http-status";
import { Response } from "express";
import sendResponse from "./sendResponse";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const noDataFoundResponse = (res: Response, result: any) => {
  if (result.length === 0 || !result) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: "No Data Found",
      data: result,
    });
  }
};
