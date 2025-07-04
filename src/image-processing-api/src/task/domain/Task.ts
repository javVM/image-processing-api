import { Image } from "./Image";
import { Status } from "./Status";
import { Price } from "./Price";

export class Task {
  taskId: string;
  status: Status;
  price: Price;
  images?: Image[];

  constructor(taskId: string, status: Status, price: Price, images?: Image[]) {
    this.taskId = taskId;
    this.status = status;
    this.price = price;
    if (images?.length) {
      this.images = images;
    }
  }
}
