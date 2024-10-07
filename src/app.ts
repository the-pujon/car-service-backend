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

app.post("/api/booking-success", express.json(), (req, res) => {
  // Process the POST data from the payment gateway
  console.log("Payment success data:", req.body);

  // Save the data to your database here

  // Redirect to the React app with query parameters
  res.redirect(302, `http://localhost:5173/booking-success`);
});

app.post("/api/booking-failed", express.json(), (req, res) => {
  // Process the POST data from the payment gateway
  console.log("Payment success data:", req.body);

  // Save the data to your database here

  // Redirect to the React app with query parameters
  res.redirect(302, `http://localhost:5173/booking-fail`);
});

app.use(notFoundRouteHandler);
app.use(globalErrorHandler);

export default app;
