import { CreateTask } from "../CreateTask";
import { TaskRepository } from "../../../domain/repositories/TaskRepository";
import { Task } from "../../../domain/entities/Task";
import { Status } from "../../../domain/entities/Status";
import { Price } from "../../../domain/entities/Price";
import { ImagePath } from "../../../domain/entities/ImagePath";

describe("CreateTask Use case", () => {
  const filePath = "/input/path";

  test("Call repository.createTask and return the created Task", async () => {
    const path = `${filePath}.png`;
    const mockTask = new Task("686a5943ca86e76f9fef21bd", Status.PENDING, new Price(25));

    const repository: TaskRepository = {
      createTask: jest.fn().mockResolvedValue(mockTask),
      getTask: jest.fn(),
      updateTaskStatus: jest.fn(),
    };
    const createTask = new CreateTask(repository);
    const result = await createTask.execute(path);
    expect(repository.createTask).toHaveBeenCalledTimes(1);
    expect(repository.createTask).toHaveBeenCalledWith(expect.any(ImagePath));
    expect(repository.createTask).toHaveBeenCalledWith(expect.objectContaining({ value: path }));
    expect(result).toBe(mockTask);
  });

  test("Throw error if the path is invalid", async () => {
    const repository: TaskRepository = {
      createTask: jest.fn(),
      getTask: jest.fn(),
      updateTaskStatus: jest.fn(),
    };
    const createTask = new CreateTask(repository);
    await expect(createTask.execute("")).rejects.toThrow("No file path provided.");
    await expect(createTask.execute(`${filePath}.bmp`)).rejects.toThrow(
      "File extension not allowed. Allowed extensions: .jpg, .jpeg, .png, .webp, .svg, .gif."
    );
  });
});

test("Throw error if repository.createTask throws", async () => {
  const errorMessage = "Task persistance error";
  const error = new Error(errorMessage);
  const repository: TaskRepository = {
    createTask: jest.fn().mockRejectedValue(error),
    getTask: jest.fn(),
    updateTaskStatus: jest.fn(),
  };
  const createTask = new CreateTask(repository);
  await expect(createTask.execute("/valid/path.png")).rejects.toThrow(errorMessage);
});
