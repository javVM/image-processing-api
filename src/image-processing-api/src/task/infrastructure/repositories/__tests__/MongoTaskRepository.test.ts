import { TaskModel } from "../../database/mongo/TaskModel";
import { Status } from "../../../domain/entities/Status";
import { ImagePath } from "../../../domain/entities/ImagePath";
import { TaskSaveError } from "../../errors/TaskSaveError";
import { MongoTaskRepository } from "../MongoTaskRepository";
import { TaskRetrievalError } from "../../errors/TaskRetrievalError";
import { TaskStatusUpdateError } from "../../errors/TaskStatusUpdateError";

jest.mock("../../database/mongo/TaskModel");
jest.mock("../../database/mongo/ImageModel");

describe("MongoTaskRepository", () => {
  const repository = new MongoTaskRepository();
  const taskId = "686a599b89f098ba15fbaf90";
  const imagePath = "/input/image.png";
  const genericError = "Internal server error";

  test("Create and return task", async () => {
    const mockSave = jest.fn().mockResolvedValue({
      _id: taskId,
      status: "pending",
      price: 50,
    });

    (TaskModel as any).mockImplementation(() => ({
      save: mockSave,
    }));

    const result = await repository.createTask(new ImagePath(imagePath));
    const taskData = result.getValue();
    expect(taskData.taskId).toBe(taskId);
    expect(taskData.status).toBe(Status.PENDING);
  });

  test("Throw TaskSaveError on failure", async () => {
    (TaskModel as any).mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error(genericError)),
    }));
    await expect(repository.createTask(new ImagePath(imagePath))).rejects.toThrow(TaskSaveError);
  });

  test("Get task", async () => {
    const fakeTask = {
      _id: taskId,
      status: Status.COMPLETED,
      price: 50,
      images: [
        { path: "/output/image/800/7a53928fa4dd31e82c6ef826f341daec.png", resolution: "800" },
        { path: "/output/image/1024/021bbc7ee20b71134d53e20206bd6feb.png", resolution: "1024" },
      ],
    };

    (TaskModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(fakeTask),
    });

    const task = await repository.getTask(fakeTask._id.toString());
    const taskData = task?.getValue();
    const taskImages = taskData?.images ?? [];
    expect(task).not.toBeNull();
    expect(taskImages.length).toBe(2);
    expect(taskImages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ resolution: "1024" }),
        expect.objectContaining({ resolution: "800" }),
      ])
    );
  });

  test("Return null is taskId is invalid ObjectId", async () => {
    const result = await repository.getTask("invalid-id");
    expect(result).toBeNull();
  });

  test("Return null if task not found", async () => {
    (TaskModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });
    const result = await repository.getTask(taskId);
    expect(result).toBeNull();
  });

  test("Update task status", async () => {
    (TaskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
    await expect(repository.updateTaskStatus(taskId, Status.COMPLETED)).resolves.toBeUndefined();
    expect(TaskModel.findByIdAndUpdate).toHaveBeenCalledWith(taskId, { status: Status.COMPLETED });
  });

  test("Throw TaskRetrievalError on failure", async () => {
    (TaskModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error(genericError)),
    });
    await expect(repository.getTask(taskId)).rejects.toThrow(TaskRetrievalError);
  });

  test("Throw TaskStatusUpdateError on failure", async () => {
    (TaskModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error(genericError));
    await expect(repository.updateTaskStatus(taskId, Status.FAILED)).rejects.toThrow(TaskStatusUpdateError);
  });
});
