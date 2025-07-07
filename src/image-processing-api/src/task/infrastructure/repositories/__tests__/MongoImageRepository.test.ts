import { MongoImageRepository } from "../MongoImageRepository";
import { ImageModel } from "../../database/mongo/ImageModel";
import { TaskModel } from "../../database/mongo/TaskModel";
import { Status } from "../../../domain/entities/Status";
import { Image } from "../../../domain/entities/Image";
import { ImagePath } from "../../../domain/entities/ImagePath";
import { ImageSaveError } from "../../errors/ImageSaveError";

jest.mock("../../database/mongo/ImageModel");
jest.mock("../../database/mongo/TaskModel");

describe("MongoImageRepository", () => {
  const repository = new MongoImageRepository();
  const taskId = "686a599b89f098ba15fbaf90";
  const fakeImages = [
    new Image(new ImagePath("/output/image/800/7a53928fa4dd31e82c6ef826f341daec.png"), "800"),
    new Image(new ImagePath("/output/image/1024/021bbc7ee20b71134d53e20206bd6feb.png"), "1024"),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Insert images and update task status", async () => {
    const firstImageId = "686a6e3c96d3016e1940e8b3";
    const secondImageId = "686a91797f175e5e5c684813";

    (ImageModel.insertMany as jest.Mock).mockResolvedValue([{ _id: firstImageId }, { _id: secondImageId }]);

    (TaskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    await repository.generateTaskImages(taskId, fakeImages);

    expect(ImageModel.insertMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/output/image/800/7a53928fa4dd31e82c6ef826f341daec.png",
          md5: "7a53928fa4dd31e82c6ef826f341daec",
          resolution: "800",
        }),
        expect.objectContaining({
          path: "/output/image/1024/021bbc7ee20b71134d53e20206bd6feb.png",
          md5: "021bbc7ee20b71134d53e20206bd6feb",
          resolution: "1024",
        }),
      ])
    );
    expect(TaskModel.findByIdAndUpdate).toHaveBeenCalledWith(taskId, {
      images: [firstImageId, secondImageId],
      status: Status.COMPLETED,
    });
  });

  test("Throw ImageSaveError on failure", async () => {
    (ImageModel.insertMany as jest.Mock).mockRejectedValue(new Error("Internal server error"));
    await expect(repository.generateTaskImages(taskId, fakeImages)).rejects.toThrow(ImageSaveError);
  });
});
