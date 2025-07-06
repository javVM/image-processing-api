import { DomainError } from "./DomainError";

export class InvalidPriceError extends DomainError {
  readonly statusCode = 400;
  constructor(minimumValue: number, maximumValue: number) {
    super(`Price must be between ${minimumValue} and ${maximumValue}.`);
  }
}
