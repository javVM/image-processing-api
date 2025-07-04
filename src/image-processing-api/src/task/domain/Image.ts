import { ImagePath } from "./ImagePath";

export class Image {
  path: ImagePath;
  resolution: string;

  constructor(path: ImagePath, resolution: string) {
    this.path = path;
    this.resolution = resolution;
  }
}
