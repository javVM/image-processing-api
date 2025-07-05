import { CreateTask } from "../../application/createTask/CreateTask";
import { GetTask } from "../../application/getTask/GetTask";
import { MongoTaskRepository } from "../repositories/MongoTaskRepository";

const taskRepository = new MongoTaskRepository();

export const ServiceContainer = {
  getTask: new GetTask(taskRepository),
  createTask: new CreateTask(taskRepository)
};
