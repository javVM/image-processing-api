import { Image } from "../Image";
import { ImagePath } from "../ImagePath";

describe("Image Entity", () => {
  const resolution = "800";
  const path = "images/123.png";
  const imagePath = new ImagePath(path);

  test("Create an image with given path and resolution", () => {
    const image = new Image(imagePath, resolution);
    expect(image.path).toBe(imagePath);
    expect(image.resolution).toBe(resolution);
  });

  test("Create an image with given path and resolution", () => {
    const image = new Image(imagePath, resolution);
    expect(image.getValue()).toEqual({
      resolution,
      path,
    });
  });
});
