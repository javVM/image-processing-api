import { ImagePath } from "../entities/ImagePath";
import { Status } from "../entities/Status";
import { Task } from "../entities/Task";

export interface TaskRepository {
  createTask(path: ImagePath): Promise<Task>;
  getTask(taskId: string): Promise<Task | null>;
  updateTaskStatus(taskId: string, status: Status): Promise<void>;
}
