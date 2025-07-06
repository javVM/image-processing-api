import { CreateTask } from "../../application/createTask/CreateTask";
import { GenerateTaskImages } from "../../application/generateTaskImages/GenerateTaskImages";
import { GetTask } from "../../application/getTask/GetTask";
import { UpdateTaskStatus } from "../../application/updateTaskStatus/UpdateTaskStatus";
import { SharpImageGenerator } from "../imageGenerator/SharpImageGenerator";
import { MongoImageRepository } from "../repositories/MongoImageRepository";
import { MongoTaskRepository } from "../repositories/MongoTaskRepository";

const taskRepository = new MongoTaskRepository();
const imageRepository = new MongoImageRepository();
const imageGenerator = new SharpImageGenerator();

export const ServiceContainer = {
  getTask: new GetTask(taskRepository),
  createTask: new CreateTask(taskRepository),
  updateTaskStatus: new UpdateTaskStatus(taskRepository),
  generateTaskImages: new GenerateTaskImages(imageGenerator, imageRepository),
};
