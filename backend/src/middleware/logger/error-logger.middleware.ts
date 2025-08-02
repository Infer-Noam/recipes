import { createLogger } from "./index";
import type { ErrorRequestHandler } from "express";

const errorLogger: ErrorRequestHandler = (err, _req, _res, next) => {
  createLogger(`${err.name}: ${err.message}`, "errorLog.txt");
  console.error(err.stack);
  next(err);
};

export default errorLogger;
