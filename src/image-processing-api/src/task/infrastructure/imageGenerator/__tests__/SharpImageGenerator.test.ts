jest.mock("fs");
jest.mock("sharp");
jest.mock("axios");

import { SharpImageGenerator } from "../SharpImageGenerator";
import { ImagePath } from "../../../domain/entities/ImagePath";
import * as fs from "fs";
import sharp from "sharp";
import axios from "axios";

describe("SharpImageGenerator", () => {
  const imageGenerator = new SharpImageGenerator();
  const imagePath = "/input/image.jpg";
  const fakeImageData = "fakeImageData";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Generate images for local path", async () => {
    const fakeBuffer = Buffer.from(fakeImageData);
    const mockedReadFileSync = fs.readFileSync as jest.Mock;
    const mockedMkdirSync = fs.mkdirSync as jest.Mock;
    const mockedSharp = sharp as unknown as jest.Mock;
    mockedReadFileSync.mockReturnValue(fakeBuffer);
    mockedMkdirSync.mockImplementation(() => {});
    mockedSharp.mockReturnValue({
      resize: jest.fn().mockReturnThis(),
      toFormat: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockResolvedValue(undefined),
    });

    const result = await imageGenerator.generate(new ImagePath(imagePath));
    expect(result.length).toBe(2); // Both resolutions to create
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ resolution: "1024" }),
        expect.objectContaining({ resolution: "800" }),
      ])
    );
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toHaveBeenCalled();
    expect(sharp).toHaveBeenCalledWith(fakeBuffer);
  });

  test("Throw ImageGenerationError if sharp fails", async () => {
    const mockedReadFileSync = fs.readFileSync as jest.Mock;
    const mockedSharp = sharp as unknown as jest.Mock;
    mockedReadFileSync.mockReturnValue(Buffer.from(fakeImageData));
    mockedSharp.mockImplementation(() => {
      throw new Error("Sharp error");
    });
    await expect(imageGenerator.generate(new ImagePath(imagePath))).rejects.toThrow(
      "Failed to generate images: Sharp error."
    );
  });

  test("Generate images for URL", async () => {
    const imageUrl = "https://test.com/image.jpg";
    const fakeBuffer = Buffer.from(fakeImageData);
    const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;
    const mockedSharp = sharp as unknown as jest.Mock;

    mockedAxiosGet.mockResolvedValue({ data: fakeBuffer });
    mockedSharp.mockReturnValue({
      resize: jest.fn().mockReturnThis(),
      toFormat: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockResolvedValue(undefined),
    });

    const imageGenerator = new SharpImageGenerator();
    const urlPath = new ImagePath(imageUrl);

    const result = await imageGenerator.generate(urlPath);
    expect(result.length).toBe(2); // Both resolutions to create
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ resolution: "1024" }),
        expect.objectContaining({ resolution: "800" }),
      ])
    );
    expect(mockedAxiosGet).toHaveBeenCalledWith(imageUrl, { responseType: "arraybuffer" });
    expect(mockedSharp).toHaveBeenCalledWith(fakeBuffer);
  });
});
