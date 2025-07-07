import { ImagePath } from "./ImagePath";

export class Image {
  readonly path: ImagePath;
  readonly resolution: string;

  constructor(path: ImagePath, resolution: string) {
    this.path = path;
    this.resolution = resolution;
  }

  public getValue() {
    return {
      resolution: this.resolution,
      path: this.path.value,
    };
  }
}
