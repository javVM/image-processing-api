import { ImagePath } from "./ImagePath";
import { Task } from "./Task";

export interface TaskRepository {
  createTask(path: ImagePath): Promise<Task>;
  getTask(taskId: string): Promise<Task>;
}
