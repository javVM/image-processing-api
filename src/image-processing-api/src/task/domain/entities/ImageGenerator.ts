import { ImagePath } from "./ImagePath";
import { Image } from "./Image";

export interface ImageGenerator {
  generate(originalPath: ImagePath): Promise<Image[]>;
}
