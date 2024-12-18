import express, { Application, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundRouteHandler from "./app/middlewares/notFoundRouteHandler";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
  }),
);

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    status: "success",
    message: "Welcome to car washing service api",
  });
});

app.post("/api/booking-success", (req, res) => {
  // console.log(req);
  res.redirect(302, `${process.env.FRONTEND_URL as string}/booking-success`);
});

// console.log(process.env.FRONTEND_URL);

app.post("/api/booking-failed", express.json(), (req, res) => {
  res.redirect(302, `${process.env.FRONTEND_URL as string}/booking-fail`);
});

app.use(notFoundRouteHandler);
app.use(globalErrorHandler);

export default app;
