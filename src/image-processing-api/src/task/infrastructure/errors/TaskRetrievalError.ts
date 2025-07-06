export class TaskRetrievalError extends Error {
  constructor(taskId: string, message: string) {
    super(`Failed to retrieve task with taskId ${taskId} from database: ${message}.`);
    this.name = this.constructor.name;
  }
}
