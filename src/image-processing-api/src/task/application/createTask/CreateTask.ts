import { ImagePath } from "../../domain/ImagePath";
import { Task } from "../../domain/Task";
import { TaskRepository } from "../../domain/TaskRepository";

export class CreateTask {
  constructor(private repository: TaskRepository) {}

  async execute(path: string): Promise<Task> {
    const imagePath = new ImagePath(path);
    return this.repository.createTask(imagePath);
  }
}
