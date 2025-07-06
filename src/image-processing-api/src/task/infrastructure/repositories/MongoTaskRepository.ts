import { FlattenMaps } from "mongoose";
import { Image } from "../../domain/entities/Image";
import { ImagePath } from "../../domain/entities/ImagePath";
import { Price } from "../../domain/entities/Price";
import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";
import { Status } from "../../domain/entities/Status";
import { ImageDocument } from "../database/mongo/ImageModel";
import { TaskModel } from "../database/mongo/TaskModel";
import * as _ from "lodash";
import { TaskSaveError } from "../errors/TaskSaveError";
import { TaskRetrievalError } from "../errors/TaskRetrievalError";
import { TaskStatusUpdateError } from "../errors/TaskStatusUpdate";

export class MongoTaskRepository implements TaskRepository {
  constructor() {}

  async createTask(path: ImagePath): Promise<Task> {
    try {
      const status = Status.PENDING;
      const newPrice = new Price();
      const newTask = new TaskModel({ status, originalPath: path.value, price: newPrice.value });
      const createdTask = await newTask.save();
      return new Task(createdTask._id.toString(), createdTask.status as Status, newPrice);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new TaskSaveError(error.message);
      }
      throw new TaskSaveError("An unexpected error occurred while saving the task");
    }
  }

  async getTask(taskId: string): Promise<Task | null> {
    try {
      const imagesProperty = "images";
      const populateFields = "resolution path";
      const foundTask = await TaskModel.findOne({ _id: taskId }).populate(imagesProperty, populateFields).lean().exec();
      if (!foundTask) {
        return null;
      }
      const formattedImages =
        foundTask?.images
          ?.filter((image): image is FlattenMaps<ImageDocument> => _.isObject(image))
          .map(image => {
            const imagePath = new ImagePath(image.path);
            return new Image(imagePath, image.resolution);
          }) ?? [];
      return new Task(
        foundTask._id.toString(),
        foundTask.status as Status,
        new Price(foundTask.price),
        formattedImages
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new TaskRetrievalError(taskId, error.message);
      }
      throw new TaskRetrievalError(taskId, `An unexpected error occurred while retrieving the task`);
    }
  }

  async updateTaskStatus(taskId: string, status: Status): Promise<void> {
    try {
      await TaskModel.findByIdAndUpdate(taskId, { status });
    } catch (error) {
      if (error instanceof Error) {
        throw new TaskStatusUpdateError(taskId, status, error.message);
      }
      throw new TaskStatusUpdateError(
        taskId,
        status,
        `An unexpected error occurred while trying to update the task's status`
      );
    }
  }
}
