export class TaskStatusUpdateError extends Error {
  constructor(taskId: string, message: string) {
    super(`Failed to update task ${taskId}'s status: ${message}.`);
    this.name = "TaskStatusUpdateError";
  }
}
