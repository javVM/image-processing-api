import { DomainError } from "./DomainError";

export class TaskNotFoundError extends DomainError {
  readonly statusCode = 404;
  constructor(taskId: string) {
    super(`Task with id ${taskId} not found.`);
  }
}
