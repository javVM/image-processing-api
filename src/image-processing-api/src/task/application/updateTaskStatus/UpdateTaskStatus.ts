import { Status } from "../../domain/entities/Status";
import { Task } from "../../domain/entities/Task";
import { TaskNotFoundError } from "../../domain/errors/TaskNotFoundError";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class UpdateTaskStatus {
  constructor(private repository: TaskRepository) {}

  async execute(taskId: string, status: Status): Promise<void> {
    await this.repository.updateTaskStatus(taskId, status);
  }
}
