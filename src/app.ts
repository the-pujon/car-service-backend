import express, { Application, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundRouteHandler from "./app/middlewares/notFoundRouteHandler";
import { ServiceRoutes } from "./app/modules/service/service.route";

const app: Application = express();

app.use(express.json());
app.use(cors());

//app.use("/api", router);
//app.use("api/services", ServiceRoutes);

app.get("api/services", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    status: "success",
    message: "Welcome to car washing service api",
  });
});

app.use(notFoundRouteHandler);
app.use(globalErrorHandler);

export default app;
