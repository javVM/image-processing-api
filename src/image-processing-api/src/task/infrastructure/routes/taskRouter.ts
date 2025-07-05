import { Router } from "express";
import { getTask, createTask } from "../controllers/taskController";

const TaskRouter = Router();

TaskRouter.post("/", createTask);
TaskRouter.get("/:taskId", getTask);

export { TaskRouter };
