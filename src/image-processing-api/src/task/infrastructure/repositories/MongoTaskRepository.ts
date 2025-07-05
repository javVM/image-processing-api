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

export class MongoTaskRepository implements TaskRepository {
  constructor() {}

  async createTask(path: ImagePath): Promise<Task> {
    const status = Status.PENDING;
    const randomPrice = Price.random();
    const newTask = new TaskModel({ status, originalPath: path.value, price: randomPrice.value });
    const createdTask = await newTask.save();
    return new Task(createdTask._id.toString(), createdTask.status as Status, new Price(createdTask.price));
  }

  async getTask(taskId: string): Promise<Task | null> {
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
    return new Task(foundTask._id.toString(), foundTask.status as Status, new Price(foundTask.price), formattedImages);
  }
}
