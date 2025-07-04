export class ImagePath {
  private readonly allowedExtensions = ["jpg", "jpeg", "png"];
  value: string;

  constructor(value: string) {
    this.checkIsValid(value);
    this.value = value;
  }

  private checkIsValid(value: string) {
    if (!value) {
      throw new Error("No file selected");
    }
    const separator = ".";
    const fileExtension = value.split(separator).pop() ?? "";
    if (!this.allowedExtensions.includes(fileExtension)) {
      throw new Error(`File extension not allowed. Allowed extensions: ${this.allowedExtensions.join(", ")}`);
    }
  }
}
