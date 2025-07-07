import { Task } from "../Task";
import { Status } from "../Status";
import { Price } from "../Price";
import { Image } from "../Image";
import { ImagePath } from "../ImagePath";

describe("Task Entity", () => {
  const taskId = "686a5943ca86e76f9fef21bd";
  const status = Status.PENDING;
  const price = new Price(25);
  const image = new Image(new ImagePath("/output/image.png"), "800");

  test("Create a task with images", () => {
    const task = new Task(taskId, status, price, [image]);
    const value = task.getValue();
    expect(value).toEqual({
      taskId,
      status,
      price: 25,
      images: [
        {
          resolution: "800",
          path: "/output/image.png",
        },
      ],
    });
  });

  test("Create a task without images", () => {
    const task = new Task(taskId, status, price);
    const value = task.getValue();
    expect(value).toEqual({
      taskId,
      status,
      price: 25,
    });
  });
});
