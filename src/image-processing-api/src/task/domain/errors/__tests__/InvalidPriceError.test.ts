import { DomainError } from "../DomainError";
import { InvalidPriceError } from "../InvalidPriceError";

describe("InvalidPriceError", () => {
  test("Create an error with the correct message and status code", () => {
    const minimumValue = 5;
    const maximumValue = 50;
    const error = new InvalidPriceError(minimumValue, maximumValue);

    expect(error).toBeInstanceOf(InvalidPriceError);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.message).toBe(`Price must be between ${minimumValue} and ${maximumValue}.`);
    expect(error.statusCode).toBe(400);
  });
});
