export class TaskRetrievalError extends Error {
  constructor(taskId: string, message: string) {
    super(`Failed to retrieve task with id ${taskId} from database: ${message}.`);
    this.name = "TaskRetrievalError";
  }
}
