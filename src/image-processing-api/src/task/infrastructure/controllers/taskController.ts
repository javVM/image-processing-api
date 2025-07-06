import { Request, Response } from "express";
import { ServiceContainer } from "../services/serviceContainer";

export const createTask = async (req: Request, res: Response) => {
  try {
    const originalPath = req.body.path;
    const task = await ServiceContainer.createTask.execute(originalPath);
    const structuredTask = task.getValue();
    ServiceContainer.generateTaskImages.execute(structuredTask.taskId, originalPath);
    res.status(201).json(structuredTask);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = await ServiceContainer.getTask.execute(taskId);
    if (!task) {
      res.status(404).send(`Task with id ${taskId} not found`);
    }
    res.status(200).json(task.getValue());
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};
