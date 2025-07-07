import { Status } from "../../domain/entities/Status";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class UpdateTaskStatus {
  constructor(private repository: TaskRepository) {}

  async execute(taskId: string, status: Status): Promise<void> {
    await this.repository.updateTaskStatus(taskId, status);
  }
}
