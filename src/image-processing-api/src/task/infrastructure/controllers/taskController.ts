import { NextFunction, Request, Response } from "express";
import { ServiceContainer } from "../services/serviceContainer";
import { Status } from "../../domain/entities/Status";

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const originalPath = req.body?.path ?? "";
    const task = await ServiceContainer.createTask.execute(originalPath);
    const structuredTask = task.getValue();
    ServiceContainer.generateTaskImages.execute(structuredTask.taskId, originalPath).catch(async error => {
      console.error(error.message);
      try {
        await ServiceContainer.updateTaskStatus.execute(structuredTask.taskId, Status.FAILED);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    });
    res.status(201).json(structuredTask);
  } catch (error: unknown) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId;
    const task = await ServiceContainer.getTask.execute(taskId);
    res.status(200).json(task.getValue());
  } catch (error: unknown) {
    next(error);
  }
};
