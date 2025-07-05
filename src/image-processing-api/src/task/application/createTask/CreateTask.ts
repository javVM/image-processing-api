import { ImagePath } from "../../domain/entities/ImagePath";
import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/repositories/TaskRepository";

export class CreateTask {
  constructor(private repository: TaskRepository) {}

  async execute(path: string): Promise<Task> {
    const imagePath = new ImagePath(path);
    return this.repository.createTask(imagePath);
  }
}
