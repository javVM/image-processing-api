import sharp from "sharp";
import axios from "axios";
import crypto from "crypto";
import * as path from "path";
import * as fs from "fs";
import { ImageGenerator } from "../../domain/entities/ImageGenerator";
import { ImagePath } from "../../domain/entities/ImagePath";
import { Image } from "../../domain/entities/Image";
import { ImageGenerationError } from "../errors/ImageGenerationError";

export class SharpImageGenerator implements ImageGenerator {
  private availableWidths = [1024, 800];
  // Some formats cannot be stored with the same extension after being transformed
  private extensionTransformationMap: { [key: string]: string } = {
    gif: "png",
    svg: "png",
  };

  constructor() {}

  private isURL(filePath: string) {
    return /^https?:\/\//i.test(filePath);
  }

  private async downloadImage(imageUrl: string) {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  }

  async generate(originalPath: ImagePath): Promise<Image[]> {
    try {
      const images: Image[] = [];
      const baseDir = process.cwd();
      const posixBaseDir = baseDir.replace(/\\/g, "/");
      const outputDir = process.env.OUTPUT_DIR ?? "/output";
      const originalPathValue = originalPath.value;
      const fileNameWithExtension = path.basename(originalPath.value);
      let extension = path.extname(fileNameWithExtension).slice(1);
      if (this.extensionTransformationMap[extension]) {
        extension = this.extensionTransformationMap[extension];
      }
      const fileName = path.basename(fileNameWithExtension, `.${extension}`);
      const imageBuffer = this.isURL(originalPathValue)
        ? await this.downloadImage(originalPathValue)
        : fs.readFileSync(path.join(baseDir, originalPathValue));

      for (const width of this.availableWidths) {
        const md5Identifier = crypto.createHash("md5").update(width.toString()).digest("hex");
        const newImageFileName = `${md5Identifier}.${extension}`;
        const imageOutPutDir = path.posix.join(outputDir, fileName, width.toString());
        const fullOutputDir = path.posix.join(posixBaseDir, imageOutPutDir);
        fs.mkdirSync(fullOutputDir, { recursive: true });
        const outputPath = path.posix.join(fullOutputDir, newImageFileName);
        const newImagePath = path.posix.join(imageOutPutDir, newImageFileName);
        await sharp(imageBuffer)
          .resize({ width })
          .toFormat(extension as keyof sharp.FormatEnum)
          .toFile(outputPath);
        images.push(new Image(new ImagePath(newImagePath), width.toString()));
      }

      return images;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new ImageGenerationError(error.message);
      }
      throw new ImageGenerationError("Unknown error during image generation");
    }
  }
}
