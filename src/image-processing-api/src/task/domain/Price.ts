export class Price {
  private readonly minimumValue = 5;
  private readonly maximumValue = 5;
  value: number;

  constructor(value: number) {
    this.checkIsValid(value);
    this.value = value;
  }

  private checkIsValid(value: number) {
    if (value < this.minimumValue || value > this.maximumValue) {
      throw new Error(`Price must be between ${this.minimumValue} and ${this.maximumValue}`);
    }
  }
}
