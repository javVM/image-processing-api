import { GetTask } from "../GetTask";
import { TaskRepository } from "../../../domain/repositories/TaskRepository";
import { Task } from "../../../domain/entities/Task";
import { Status } from "../../../domain/entities/Status";
import { Price } from "../../../domain/entities/Price";
import { ImagePath } from "../../../domain/entities/ImagePath";
import { TaskNotFoundError } from "../../../domain/errors/TaskNotFoundError";

describe("GetTask Use case", () => {
  const taskId = "686a5943ca86e76f9fef21bd";

  test("Call repository.createTask and return the found task", async () => {
    const mockTask = new Task(taskId, Status.PENDING, new Price(25));
    const repository: TaskRepository = {
      getTask: jest.fn().mockResolvedValue(mockTask),
      createTask: jest.fn(),
      updateTaskStatus: jest.fn(),
    };
    const getTask = new GetTask(repository);
    const result = await getTask.execute(taskId);
    expect(repository.getTask).toHaveBeenCalledWith(taskId);
    expect(result).toBe(mockTask);
  });

  test("Throw TaskNotFoundError if task not found", async () => {
    const repository: TaskRepository = {
      getTask: jest.fn().mockResolvedValue(null),
      createTask: jest.fn(),
      updateTaskStatus: jest.fn(),
    };
    const getTask = new GetTask(repository);
    await expect(getTask.execute(taskId)).rejects.toThrow(`Task with taskId ${taskId} not found.`);
  });

  test("Throw error if repository.getTask throws", async () => {
    const errorMessage = "Task retrieval error";
    const error = new Error(errorMessage);
    const repository: TaskRepository = {
      createTask: jest.fn(),
      getTask: jest.fn().mockRejectedValue(error),
      updateTaskStatus: jest.fn(),
    };
    const getTask = new GetTask(repository);
    await expect(getTask.execute(taskId)).rejects.toThrow(errorMessage);
  });
});
