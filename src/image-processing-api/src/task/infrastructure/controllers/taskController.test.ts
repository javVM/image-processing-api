import request from "supertest";
import app from "../../../app";
import { connect, clearDatabase, closeDatabase, clearOutputDir } from "../../../../test/setup";
import { TaskModel } from "../database/mongo/TaskModel";
import { Status } from "../../domain/entities/Status";
import { ImageModel } from "../database/mongo/ImageModel";
import { Image } from "../../domain/entities/Image";
import path from "path";

const TEST_TIMEOUT_MS = 5000; // Max time before the test times out
const WAIT_TIME_MS = 2000; // Time in ms to wait before trying to retrieve the created task's data

beforeAll(async () => {
  process.env.OUTPUT_DIR = "test/output";
  await connect();
  const images = require("../../../../test/data/images.json");
  const tasks = require("../../../../test/data/tasks.json");
  await Promise.all([ImageModel.insertMany(images), TaskModel.insertMany(tasks)]);
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
  if (process.env.OUTPUT_DIR) {
    const fullOutputDir = path.join(process.cwd(), process.env.OUTPUT_DIR);
    clearOutputDir(fullOutputDir);
  }
});

describe("Create task", () => {
  it("Create task with valid path format (201)", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ path: "test/path/to/image.png" })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toHaveProperty("taskId");
    expect(typeof response.body.taskId).toBe("string");
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe(Status.PENDING);
    expect(response.body).toHaveProperty("price");
    expect(typeof response.body.price).toBe("number");
    expect(response.body.price).toBeGreaterThanOrEqual(5);
    expect(response.body.price).toBeLessThanOrEqual(50);
    expect(response.body).not.toHaveProperty("images");
  });

  it("No path in body (400)", async () => {
    const response = await request(app).post("/tasks").send({}).expect(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No file path provided.");
  });

  it("Empty path (400)", async () => {
    const response = await request(app).post("/tasks").send({ path: "" }).expect(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No file path provided.");
  });

  it("Invalid file extension (400)", async () => {
    const response = await request(app).post("/tasks").send({ path: "test/path/to/image.pdf" }).expect(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "File extension not allowed. Allowed extensions: .jpg, .jpeg, .png, .webp, .svg, .gif."
    );
  });
});

describe("Get populated task", () => {
  it("Get PENDING task", async () => {
    const foundTaskId = "686a5943ca86e76f9fef21bd";
    const response = await request(app).get(`/tasks/${foundTaskId}`).expect("Content-Type", /json/).expect(200);
    expect(response.body).toHaveProperty("taskId");
    expect(response.body.taskId).toBe(foundTaskId);
    expect(response.body).toHaveProperty("price");
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe(Status.PENDING);
    expect(response.body).not.toHaveProperty("images");
  });

  it("Get FAILED task", async () => {
    const foundTaskId = "686a5943ca86e76f9fef21be";
    const response = await request(app).get(`/tasks/${foundTaskId}`).expect("Content-Type", /json/).expect(200);
    expect(response.body).toHaveProperty("taskId");
    expect(response.body.taskId).toBe(foundTaskId);
    expect(response.body).toHaveProperty("price");
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe(Status.FAILED);
    expect(response.body).not.toHaveProperty("images");
  });

  it("Get COMPLETED task", async () => {
    const foundTaskId = "686a5943ca86e76f9fef21bf";
    const response = await request(app).get(`/tasks/${foundTaskId}`).expect("Content-Type", /json/).expect(200);
    expect(response.body).toHaveProperty("taskId");
    expect(response.body.taskId).toBe(foundTaskId);
    expect(response.body).toHaveProperty("price");
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe(Status.COMPLETED);
    expect(response.body).toHaveProperty("images");
    expect(Array.isArray(response.body.images)).toBe(true);
    response.body.images.forEach((image: Image) => {
      expect(image).toHaveProperty("path");
      expect(typeof image.path).toBe("string");
      expect(image).toHaveProperty("resolution");
      expect(typeof image.resolution).toBe("string");
    });
  });

  it("Task not found (404)", async () => {
    const invalidTaskId = "12345";
    const response = await request(app).get(`/tasks/${invalidTaskId}`).expect("Content-Type", /json/).expect(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(`Task with taskId ${invalidTaskId} not found.`);
  });
});

describe("Create and get task", () => {
  it("Create and get PENDING task (local)", async () => {
    const createResponse = await request(app)
      .post("/tasks")
      .send({ path: "/test/input/landscape.png" })
      .expect("Content-Type", /json/)
      .expect(201);
    const createdTaskId = createResponse.body.taskId;
    expect(createResponse.body).toHaveProperty("taskId");
    expect(typeof createdTaskId).toBe("string");
    expect(createResponse.body).toHaveProperty("status");
    expect(createResponse.body.status).toBe(Status.PENDING);
    expect(createResponse.body).toHaveProperty("price");
    expect(typeof createResponse.body.price).toBe("number");
    expect(createResponse.body.price).toBeGreaterThanOrEqual(5);
    expect(createResponse.body.price).toBeLessThanOrEqual(50);
    expect(createResponse.body).not.toHaveProperty("images");

    const getResponse = await request(app).get(`/tasks/${createdTaskId}`).expect("Content-Type", /json/).expect(200);
    expect(getResponse.body).toHaveProperty("taskId");
    expect(getResponse.body.taskId).toBe(createdTaskId);
    expect(getResponse.body).toHaveProperty("price");
    expect(getResponse.body).toHaveProperty("status");
    expect(getResponse.body.status).toBe(Status.PENDING);
    expect(getResponse.body).not.toHaveProperty("images");
  });

  it(
    "Create and get FAILED task (local)",
    async () => {
      const createResponse = await request(app)
        .post("/tasks")
        .send({ path: "/test/input/image_failed.png" })
        .expect("Content-Type", /json/)
        .expect(201);
      const createdTaskId = createResponse.body.taskId;
      expect(createResponse.body).toHaveProperty("taskId");
      expect(typeof createdTaskId).toBe("string");
      expect(createResponse.body).toHaveProperty("status");
      expect(createResponse.body.status).toBe(Status.PENDING);
      expect(createResponse.body).toHaveProperty("price");
      expect(typeof createResponse.body.price).toBe("number");
      expect(createResponse.body.price).toBeGreaterThanOrEqual(5);
      expect(createResponse.body.price).toBeLessThanOrEqual(50);
      expect(createResponse.body).not.toHaveProperty("images");

      await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS));

      const getResponse = await request(app).get(`/tasks/${createdTaskId}`).expect("Content-Type", /json/).expect(200);
      expect(getResponse.body).toHaveProperty("taskId");
      expect(getResponse.body.taskId).toBe(createdTaskId);
      expect(getResponse.body).toHaveProperty("price");
      expect(getResponse.body).toHaveProperty("status");
      expect(getResponse.body.status).toBe(Status.FAILED);
      expect(getResponse.body).not.toHaveProperty("images");
    },
    TEST_TIMEOUT_MS
  );

  it(
    "Create and get COMPLETED task (local)",
    async () => {
      const createResponse = await request(app)
        .post("/tasks")
        .send({ path: "/test/input/landscape.png" })
        .expect("Content-Type", /json/)
        .expect(201);
      const createdTaskId = createResponse.body.taskId;
      expect(createResponse.body).toHaveProperty("taskId");
      expect(typeof createdTaskId).toBe("string");
      expect(createResponse.body).toHaveProperty("status");
      expect(createResponse.body.status).toBe(Status.PENDING);
      expect(createResponse.body).toHaveProperty("price");
      expect(typeof createResponse.body.price).toBe("number");
      expect(createResponse.body.price).toBeGreaterThanOrEqual(5);
      expect(createResponse.body.price).toBeLessThanOrEqual(50);
      expect(createResponse.body).not.toHaveProperty("images");

      await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS));

      const getResponse = await request(app).get(`/tasks/${createdTaskId}`).expect("Content-Type", /json/).expect(200);
      expect(getResponse.body).toHaveProperty("taskId");
      expect(getResponse.body.taskId).toBe(createdTaskId);
      expect(getResponse.body).toHaveProperty("price");
      expect(getResponse.body).toHaveProperty("status");
      expect(getResponse.body.status).toBe(Status.COMPLETED);
      expect(getResponse.body).toHaveProperty("images");
      getResponse.body.images.forEach((image: Image) => {
        expect(image).toHaveProperty("path");
        expect(typeof image.path).toBe("string");
        expect(image).toHaveProperty("resolution");
        expect(typeof image.resolution).toBe("string");
      });
    },
    TEST_TIMEOUT_MS
  );

  it("Create and get PENDING task (url)", async () => {
    const createResponse = await request(app)
      .post("/tasks")
      .send({ path: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png" })
      .expect("Content-Type", /json/)
      .expect(201);
    const createdTaskId = createResponse.body.taskId;
    expect(createResponse.body).toHaveProperty("taskId");
    expect(typeof createdTaskId).toBe("string");
    expect(createResponse.body).toHaveProperty("status");
    expect(createResponse.body.status).toBe(Status.PENDING);
    expect(createResponse.body).toHaveProperty("price");
    expect(typeof createResponse.body.price).toBe("number");
    expect(createResponse.body.price).toBeGreaterThanOrEqual(5);
    expect(createResponse.body.price).toBeLessThanOrEqual(50);
    expect(createResponse.body).not.toHaveProperty("images");

    const getResponse = await request(app).get(`/tasks/${createdTaskId}`).expect("Content-Type", /json/).expect(200);
    expect(getResponse.body).toHaveProperty("taskId");
    expect(getResponse.body.taskId).toBe(createdTaskId);
    expect(getResponse.body).toHaveProperty("price");
    expect(getResponse.body).toHaveProperty("status");
    expect(getResponse.body.status).toBe(Status.PENDING);
    expect(getResponse.body).not.toHaveProperty("images");
  });

  it(
    "Create and get FAILED task (url)",
    async () => {
      const createResponse = await request(app)
        .post("/tasks")
        .send({ path: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_random_image_1.png" })
        .expect("Content-Type", /json/)
        .expect(201);
      const createdTaskId = createResponse.body.taskId;
      expect(createResponse.body).toHaveProperty("taskId");
      expect(typeof createdTaskId).toBe("string");
      expect(createResponse.body).toHaveProperty("status");
      expect(createResponse.body.status).toBe(Status.PENDING);
      expect(createResponse.body).toHaveProperty("price");
      expect(typeof createResponse.body.price).toBe("number");
      expect(createResponse.body.price).toBeGreaterThanOrEqual(5);
      expect(createResponse.body.price).toBeLessThanOrEqual(50);
      expect(createResponse.body).not.toHaveProperty("images");

      await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS));

      const getResponse = await request(app).get(`/tasks/${createdTaskId}`).expect("Content-Type", /json/).expect(200);
      expect(getResponse.body).toHaveProperty("taskId");
      expect(getResponse.body.taskId).toBe(createdTaskId);
      expect(getResponse.body).toHaveProperty("price");
      expect(getResponse.body).toHaveProperty("status");
      expect(getResponse.body.status).toBe(Status.FAILED);
      expect(getResponse.body).not.toHaveProperty("images");
    },
    TEST_TIMEOUT_MS
  );

  it(
    "Create and get COMPLETED task (url)",
    async () => {
      const createResponse = await request(app)
        .post("/tasks")
        .send({ path: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png" })
        .expect("Content-Type", /json/)
        .expect(201);
      const createdTaskId = createResponse.body.taskId;
      expect(createResponse.body).toHaveProperty("taskId");
      expect(typeof createdTaskId).toBe("string");
      expect(createResponse.body).toHaveProperty("status");
      expect(createResponse.body.status).toBe(Status.PENDING);
      expect(createResponse.body).toHaveProperty("price");
      expect(typeof createResponse.body.price).toBe("number");
      expect(createResponse.body.price).toBeGreaterThanOrEqual(5);
      expect(createResponse.body.price).toBeLessThanOrEqual(50);
      expect(createResponse.body).not.toHaveProperty("images");

      await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS));

      const getResponse = await request(app).get(`/tasks/${createdTaskId}`).expect("Content-Type", /json/).expect(200);
      expect(getResponse.body).toHaveProperty("taskId");
      expect(getResponse.body.taskId).toBe(createdTaskId);
      expect(getResponse.body).toHaveProperty("price");
      expect(getResponse.body).toHaveProperty("status");
      expect(getResponse.body.status).toBe(Status.COMPLETED);
      expect(getResponse.body).toHaveProperty("images");
      getResponse.body.images.forEach((image: Image) => {
        expect(image).toHaveProperty("path");
        expect(typeof image.path).toBe("string");
        expect(image).toHaveProperty("resolution");
        expect(typeof image.resolution).toBe("string");
      });
    },
    TEST_TIMEOUT_MS
  );
});
