import { Image } from "../entities/Image";

export interface ImageRepository {
  generateTaskImages(taskId: string, images: Image[]): Promise<void>;
}
