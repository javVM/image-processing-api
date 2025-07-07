import { DomainError } from "../DomainError";
import { TaskNotFoundError } from "../TaskNotFoundError";

describe("TaskNotFoundError", () => {
  test("Create an error with the correct message and status code", () => {
    const taskId = "686a5943ca86e76f9fef21b";
    const error = new TaskNotFoundError(taskId);

    expect(error).toBeInstanceOf(TaskNotFoundError);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.message).toBe(`Task with taskId ${taskId} not found.`);
    expect(error.statusCode).toBe(404);
  });
});
