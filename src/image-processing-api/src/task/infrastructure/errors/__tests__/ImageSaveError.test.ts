import { ImageSaveError } from "../ImageSaveError";

describe("ImageSaveError", () => {
  test("Create an error with the correct message", () => {
    const testErrorMessage = "Test error message";
    const error = new ImageSaveError(testErrorMessage);
    expect(error).toBeInstanceOf(ImageSaveError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(`Failed to persist image data in database: ${testErrorMessage}.`);
  });
});
