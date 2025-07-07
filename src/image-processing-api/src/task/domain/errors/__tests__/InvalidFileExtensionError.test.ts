import { DomainError } from "../DomainError";
import { InvalidFileExtensionError } from "../InvalidFileExtensionError";

describe("InvalidFileExtensionError", () => {
  test("Create an error with the correct message and status code", () => {
    const allowedExtensions = ["jpg", "png", "gif"];
    const error = new InvalidFileExtensionError(allowedExtensions);

    expect(error).toBeInstanceOf(InvalidFileExtensionError);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.message).toBe("File extension not allowed. Allowed extensions: jpg, png, gif.");
    expect(error.statusCode).toBe(400);
  });
});
