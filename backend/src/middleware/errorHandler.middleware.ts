import type { ErrorRequestHandler } from "express";
import { HttpError } from "@shared/types/httpError.type";

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err instanceof HttpError ? err.status ?? 500 : 500;
  const message = err instanceof Error ? err.message : "Unknown error occurred";
  res.status(statusCode).json({ message });

  next();
};

export default errorHandler;
