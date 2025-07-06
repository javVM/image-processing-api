export abstract class DomainError extends Error {
  public abstract readonly statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
