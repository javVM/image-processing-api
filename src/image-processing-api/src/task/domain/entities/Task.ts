import { Image } from "./Image";
import { Status } from "./Status";
import { Price } from "./Price";

export class Task {
  private taskId: string;
  private status: Status;
  private price: Price;
  private images: Image[];

  constructor(taskId: string, status: Status, price: Price, images: Image[] = []) {
    this.taskId = taskId;
    this.status = status;
    this.price = price;
    this.images = images;
  }

  public getValue() {
    const task: {
      taskId: string;
      status: Status;
      price: number;
      images?: { resolution: string; path: string }[];
    } = {
      taskId: this.taskId,
      status: this.status,
      price: this.price.value,
    };
    if (this.images.length) {
      task.images = this.images.map(image => image.getValue());
    }
    return task;
  }
}
