import { InvalidFileExtensionError } from "../../errors/InvalidFileExtensionError";
import { NoFileSelectedError } from "../../errors/NoFileSelectedError";
import { ImagePath } from "../ImagePath";

describe("ImagePath Entity", () => {
  const fileName = "/input/test";

  test("Create image path", () => {
    const path = `${fileName}.png`;
    const imagePath = new ImagePath(path);
    expect(imagePath.value).toBe(path);
  });

  test("Throw NoFileSelectedError when no path is defined", () => {
    expect(() => new ImagePath("")).toThrow(NoFileSelectedError);
    // @ts-ignore - for test purposes
    expect(() => new ImagePath(null)).toThrow(NoFileSelectedError);
    // @ts-ignore - for test purposes
    expect(() => new ImagePath(undefined)).toThrow(NoFileSelectedError);
  });

  test("Throw InvalidFileExtensionError when path has an invalid extension", () => {
    expect(() => new ImagePath(`${fileName}.dat`)).toThrow(InvalidFileExtensionError);
    expect(() => new ImagePath(`${fileName}.pdf`)).toThrow(InvalidFileExtensionError);
    expect(() => new ImagePath(`${fileName}.gif`)).not.toThrow(InvalidFileExtensionError);
    expect(() => new ImagePath(`${fileName}.png`)).not.toThrow(InvalidFileExtensionError);
    expect(() => new ImagePath(`${fileName}.jpeg`)).not.toThrow(InvalidFileExtensionError);
    expect(() => new ImagePath(`${fileName}.jpg`)).not.toThrow(InvalidFileExtensionError);
  });
});
