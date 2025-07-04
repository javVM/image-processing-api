import { Task } from "../../domain/Task";
import { TaskRepository } from "../../domain/TaskRepository";

export class GetTask {
  constructor(private repository: TaskRepository) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.repository.getTask(taskId);

    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    return task;
  }
}
