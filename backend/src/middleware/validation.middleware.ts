import { NextFunction, Request, Response } from "express";
import { HttpError } from "@shared/types/httpError.type";
import { ZodError } from "zod";

export const validateZodSchema = (schemaOrFn: any, key?: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const schema =
      typeof schemaOrFn === "function" ? schemaOrFn(req) : schemaOrFn;
    try {
      schema.parse(key ? req.body[key] : req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues
          .map((issue) => `${issue.path.join(".")} is ${issue.message}`)
          .join("; ");
        next(new HttpError(`Invalid data: ${errorMessages}`, 400));
      } else {
        next(new HttpError("Internal Server Error -  validation", 500));
      }
    }
  };
};
