import { ImageRepository } from "../../domain/repositories/ImageRepository";
import { Image } from "../../domain/entities/Image";
import { ImageModel } from "../database/mongo/ImageModel";
import { TaskModel } from "../database/mongo/TaskModel";
import { Status } from "../../domain/entities/Status";
import path from "path";
import { ImageSaveError } from "../errors/ImageSaveError";

export class MongoImageRepository implements ImageRepository {
  async generateTaskImages(taskId: string, images: Image[]): Promise<void> {
    try {
      const createdImages = await ImageModel.insertMany(
        images.map(image => {
          const imagePath = image.path.value;
          const fileName = path.basename(imagePath, path.extname(imagePath));
          return {
            task: taskId,
            path: imagePath,
            md5: fileName,
            resolution: image.resolution,
          };
        })
      );
      const imageIds = createdImages.map(img => img._id);

      await TaskModel.findByIdAndUpdate(taskId, {
        images: imageIds,
        status: Status.COMPLETED,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new ImageSaveError(error.message);
      }
      throw new ImageSaveError("An unexpected error occurred while saving the images");
    }
  }
}
