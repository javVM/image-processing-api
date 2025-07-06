import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { DomainError } from "../../domain/errors/DomainError";

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof DomainError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  } else if (err instanceof Error) {
    res.status(500).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: "Something went wrong" });
};
