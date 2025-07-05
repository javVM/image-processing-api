import { ImagePath } from "../entities/ImagePath";
import { Task } from "../entities/Task";

export interface TaskRepository {
  createTask(path: ImagePath): Promise<Task>;
  getTask(taskId: string): Promise<Task | null>;
}
