export class TaskStatusUpdateError extends Error {
  constructor(taskId: string, status: string, message: string) {
    super(`Failed to update task ${taskId}'s status to ${status}: ${message}.`);
    this.name = "TaskStatusUpdateError";
  }
}
