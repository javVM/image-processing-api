import { GenerateTaskImages } from "../GenerateTaskImages";
import { ImageGenerator } from "../../../domain/entities/ImageGenerator";
import { ImageRepository } from "../../../domain/repositories/ImageRepository";
import { ImagePath } from "../../../domain/entities/ImagePath";
import { Image } from "../../../domain/entities/Image";

describe("GenerateTaskImages Use case", () => {
  const taskId = "686a5943ca86e76f9fef21bd";
  const originalPath = "/inpug/test.png";

  test("should generate variants and save them via repository", async () => {
    const mockVariants = [
      new Image(new ImagePath("/output/variant1.png"), "800"),
      new Image(new ImagePath("/output/variant2.png"), "1024"),
    ];

    const imageGenerator: ImageGenerator = {
      generate: jest.fn().mockResolvedValue(mockVariants),
    };
    const imageRepository: ImageRepository = {
      generateTaskImages: jest.fn().mockResolvedValue(undefined),
    };

    const generateTaskImages = new GenerateTaskImages(imageGenerator, imageRepository);
    await generateTaskImages.execute(taskId, originalPath);
    expect(imageGenerator.generate).toHaveBeenCalledTimes(1);
    expect(imageGenerator.generate).toHaveBeenCalledWith(expect.any(ImagePath));
    expect(imageRepository.generateTaskImages).toHaveBeenCalledTimes(1);
    expect(imageRepository.generateTaskImages).toHaveBeenCalledWith(taskId, mockVariants);
  });

  test("Throw error if ImagePath validation fails", async () => {
    const imageGenerator: ImageGenerator = {
      generate: jest.fn(),
    };
    const imageRepository: ImageRepository = {
      generateTaskImages: jest.fn(),
    };
    const generateTaskImages = new GenerateTaskImages(imageGenerator, imageRepository);
    await expect(generateTaskImages.execute(taskId, "")).rejects.toThrow("No file path provided.");
  });

  test("Throw error if imageGenerator.generate throws", async () => {
    const errorMessage = "Image generation failed";
    const error = new Error(errorMessage);
    const imageGenerator: ImageGenerator = {
      generate: jest.fn().mockRejectedValue(error),
    };
    const imageRepository: ImageRepository = {
      generateTaskImages: jest.fn(),
    };
    const generateTaskImages = new GenerateTaskImages(imageGenerator, imageRepository);
    await expect(generateTaskImages.execute(taskId, originalPath)).rejects.toThrow(errorMessage);
  });

  test("Throw error if imageRepository.generateTaskImages throws", async () => {
    const errorMessage = "Images persistance failed";
    const error = new Error(errorMessage);
    const imageGenerator: ImageGenerator = {
      generate: jest.fn(),
    };
    const imageRepository: ImageRepository = {
      generateTaskImages: jest.fn().mockRejectedValue(error),
    };
    const generateTaskImages = new GenerateTaskImages(imageGenerator, imageRepository);
    await expect(generateTaskImages.execute(taskId, originalPath)).rejects.toThrow(errorMessage);
  });
});
