import { DomainError } from "./DomainError";

export class InvalidFileExtensionError extends DomainError {
  readonly statusCode = 400;
  constructor(allowedExtensions: string[]) {
    super(`File extension not allowed. Allowed extensions: ${allowedExtensions.join(", ")}.`);
  }
}
