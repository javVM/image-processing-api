import { Task } from "../../domain/entities/Task";
import { TaskNotFoundError } from "../../domain/errors/TaskNotFoundError";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class GetTask {
  constructor(private repository: TaskRepository) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.repository.getTask(taskId);
    if (!task) {
      throw new TaskNotFoundError(taskId);
    }
    return task;
  }
}
