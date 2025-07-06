export class TaskSaveError extends Error {
  constructor(message: string) {
    super(`Failed to persist task data in database: ${message}.`);
    this.name = this.constructor.name;
  }
}
