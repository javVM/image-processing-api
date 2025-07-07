import { TaskRetrievalError } from "../TaskRetrievalError";

describe("TaskRetrievalError", () => {
  test("Create an error with the correct message", () => {
    const taskId = "686a5943ca86e76f9fef21bd";
    const testErrorMessage = "Test error message";
    const error = new TaskRetrievalError(taskId, testErrorMessage);
    expect(error).toBeInstanceOf(TaskRetrievalError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(`Failed to retrieve task with taskId ${taskId} from database: ${testErrorMessage}.`);
  });
});
