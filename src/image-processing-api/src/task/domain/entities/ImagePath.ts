import path from "path";
import { InvalidFileExtensionError } from "../errors/InvalidFileExtensionError";
import { NoFileSelectedError } from "../errors/NoFileSelectedError";

export class ImagePath {
  private readonly allowedExtensions = [".jpg", ".jpeg", ".png"];
  value: string;

  constructor(value: string) {
    this.checkIsValid(value);
    this.value = value;
  }

  private checkIsValid(value: string) {
    if (!value) {
      throw new NoFileSelectedError();
    }

    const fileExtension = path.extname(value);
    if (!this.allowedExtensions.includes(fileExtension)) {
      throw new InvalidFileExtensionError(this.allowedExtensions);
    }
  }
}
