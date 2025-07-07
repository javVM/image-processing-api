import { TaskSaveError } from "../TaskSaveError";

describe("TaskSaveError", () => {
  test("Create an error with the correct message", () => {
    const testErrorMessage = "Test error message";
    const error = new TaskSaveError(testErrorMessage);
    expect(error).toBeInstanceOf(TaskSaveError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(`Failed to persist task data in database: ${testErrorMessage}.`);
  });
});
