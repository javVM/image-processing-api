import { InvalidPriceError } from "../errors/InvalidPriceError";

export class Price {
  private readonly minimumValue = 5;
  private readonly maximumValue = 50;
  value: number;

  constructor(value?: number) {
    if (value) {
      this.checkIsValid(value);
      this.value = value;
    } else {
      this.value = this.getRandomPrice();
    }
  }

  private checkIsValid(value: number) {
    if (value < this.minimumValue || value > this.maximumValue) {
      throw new InvalidPriceError(this.minimumValue, this.maximumValue);
    }
  }

  private getRandomPrice(): number {
    return Math.floor(Math.random() * (this.maximumValue - this.minimumValue + 1)) + this.minimumValue;
  }
}
