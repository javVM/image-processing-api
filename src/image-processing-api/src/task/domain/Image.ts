import { ImagePath } from "./ImagePath";

export class Image {
  path: ImagePath;
  resolution: string;

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
