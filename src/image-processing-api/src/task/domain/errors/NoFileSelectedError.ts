import { DomainError } from "./DomainError";

export class NoFileSelectedError extends DomainError {
  readonly statusCode = 400;
  constructor() {
    super("No file path provided.");
  }
}
