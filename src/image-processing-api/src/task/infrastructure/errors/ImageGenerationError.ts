export class ImageGenerationError extends Error {
  constructor(message: string) {
    super(`Failed to generate images: ${message}.`);
    this.name = this.constructor.name;
  }
}
