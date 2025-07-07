import { Price } from "../Price";
import { InvalidPriceError } from "../../errors/InvalidPriceError";

describe("Price Entity", () => {
  test("Create a valid price when value is within range", () => {
    const price = new Price(25);
    expect(price.value).toBe(25);
  });

  test("Throw InvalidPriceError when value is below minimum", () => {
    expect(() => new Price(1)).toThrow(InvalidPriceError);
  });

  test("Throw InvalidPriceError when value is above maximum", () => {
    expect(() => new Price(100)).toThrow(InvalidPriceError);
  });
});
