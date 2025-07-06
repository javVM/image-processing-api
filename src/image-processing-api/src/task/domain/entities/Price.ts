import { InvalidPriceError } from "../errors/InvalidPriceError";

export class Price {
  private static minimumValue = 5;
  private static maximumValue = 50;
  value: number;

  constructor(value: number) {
    Price.checkIsValid(value);
    this.value = value;
  }

  private static checkIsValid(value: number) {
    if (value < this.minimumValue || value > this.maximumValue) {
      throw new InvalidPriceError(this.minimumValue, this.maximumValue);
    }
  }

  static random(): Price {
    const randomPrice = Math.floor(Math.random() * (this.maximumValue - this.minimumValue + 1)) + this.minimumValue;
    return new Price(randomPrice);
  }
}
