import { Status } from "../../../domain/entities/Status";
import { TaskRepository } from "../../../domain/repositories/TaskRepository";
import { UpdateTaskStatus } from "../UpdateTaskStatus";

describe("UpdateTaskStatus Use case", () => {
  const taskId = "686a5943ca86e76f9fef21bd";

  test("Call repository.updateTaskStatus with correct arguments", async () => {
    const repository: TaskRepository = {
      createTask: jest.fn(),
      getTask: jest.fn(),
      updateTaskStatus: jest.fn().mockResolvedValue(undefined),
    };
    const updateTaskStatus = new UpdateTaskStatus(repository);
    await updateTaskStatus.execute(taskId, Status.COMPLETED);
    expect(repository.updateTaskStatus).toHaveBeenCalledTimes(1);
    expect(repository.updateTaskStatus).toHaveBeenCalledWith(taskId, Status.COMPLETED);
  });

  test("Throw error if repository.updateTaskStatus throws", async () => {
    const errorMessage = "Task status update error";
    const error = new Error(errorMessage);
    const repository: TaskRepository = {
      createTask: jest.fn(),
      getTask: jest.fn(),
      updateTaskStatus: jest.fn().mockRejectedValue(error),
    };
    const updateTaskStatus = new UpdateTaskStatus(repository);
    await expect(updateTaskStatus.execute(taskId, Status.FAILED)).rejects.toThrow(errorMessage);
  });
});
