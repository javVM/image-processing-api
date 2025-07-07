import { ImageGenerationError } from "../ImageGenerationError";

describe("ImageGenerationError", () => {
  test("Create an error with the correct message", () => {
    const testErrorMessage = "Test error message";
    const error = new ImageGenerationError(testErrorMessage);
    expect(error).toBeInstanceOf(ImageGenerationError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(`Failed to generate images: ${testErrorMessage}.`);
  });
});
