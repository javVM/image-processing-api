import { Status } from "../../../domain/entities/Status";
import { TaskStatusUpdateError } from "../TaskStatusUpdateError";

describe("TaskStatusUpdateError", () => {
  test("Create an error with the correct message", () => {
    const taskId = "686a5943ca86e76f9fef21bd";
    const status = Status.FAILED;
    const testErrorMessage = "Test error message";
    const error = new TaskStatusUpdateError(taskId, status, testErrorMessage);
    expect(error).toBeInstanceOf(TaskStatusUpdateError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(`Failed to update task ${taskId}'s status to ${status}: ${testErrorMessage}.`);
  });
});
