import { ImageGenerator } from "../../domain/entities/ImageGenerator";
import { ImageRepository } from "../../domain/repositories/ImageRepository";
import { ImagePath } from "../../domain/entities/ImagePath";

export class GenerateTaskImages {
  constructor(
    private imageGenerator: ImageGenerator,
    private imageRepository: ImageRepository
  ) {}

  async execute(taskId: string, originalPath: string) {
    const imagePath = new ImagePath(originalPath);
    const variants = await this.imageGenerator.generate(imagePath);
    await this.imageRepository.generateTaskImages(taskId, variants);
  }
}
