import { DomainError } from "../DomainError";
import { NoFileSelectedError } from "../NoFileSelectedError";

describe("NoFileSelectedError", () => {
  test("Create an error with the correct message and status code", () => {
    const error = new NoFileSelectedError();

    expect(error).toBeInstanceOf(NoFileSelectedError);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.message).toBe(`No file path provided.`);
    expect(error.statusCode).toBe(400);
  });
});
