import sharp, { AvailableFormatInfo, FormatEnum } from "sharp";
import axios from "axios";
import crypto from "crypto";
import * as path from "path";
import * as fs from "fs";
import { ImageGenerator } from "../../domain/entities/ImageGenerator";
import { ImagePath } from "../../domain/entities/ImagePath";
import { Image } from "../../domain/entities/Image";

export class SharpImageGenerator implements ImageGenerator {
  private availableWidths = [1024, 800];

  constructor() {}

  private isURL(filePath: string) {
    return /^https?:\/\//i.test(filePath);
  }

  private async downloadImage(imageUrl: string) {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  }

  async generate(originalPath: ImagePath): Promise<Image[]> {
    const images: Image[] = [];
    const baseDir = process.cwd();
    const posixBaseDir = baseDir.replace(/\\/g, "/");
    const outputDir = process.env.OUTPUT_DIR ?? "/output";
    const originalPathValue = originalPath.value;
    const fileNameWithExtension = path.basename(originalPath.value);
    const extension = path.extname(fileNameWithExtension).slice(1);
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
  }
}
