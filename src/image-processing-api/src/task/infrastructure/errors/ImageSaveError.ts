export class ImageSaveError extends Error {
  constructor(message: string) {
    super(`Failed to persist image data in database: ${message}.`);
    this.name = this.constructor.name;
  }
}
