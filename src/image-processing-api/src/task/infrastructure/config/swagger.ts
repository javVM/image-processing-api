import { SwaggerOptions } from "swagger-ui-express";
import { Status } from "../../domain/entities/Status";

const TaskSwaggerOptions: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Image processing API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Image: {
          type: "object",
          properties: {
            resolution: { type: "string", example: "1024" },
            path: { type: "string", example: "/output/image1/1024/021bbc7ee20b71134d53e20206bd6feb.png" },
          },
        },
        Task: {
          type: "object",
          properties: {
            taskId: { type: "string", example: "686a6e8ccb00ef45aea7d7c8" },
            price: {
              type: "number",
              minimum: 5,
              maximum: 50,
              description: "Price must be between 5 and 50",
            },
            status: { type: "string", enum: Status, example: Status.COMPLETED },
            images: { type: "array", items: { $ref: "#/components/schemas/Image" } },
          },
          required: ["taskId", "price", "status"],
        },
        TaskCreateResponse: {
          type: "object",
          properties: {
            taskId: { type: "string", example: "686a6e8ccb00ef45aea7d7c8" },
            price: {
              type: "number",
              minimum: 5,
              maximum: 50,
              description: "Price must be between 5 and 50",
            },
            status: { type: "string", enum: Status, example: Status.PENDING },
          },
          required: ["taskId", "price", "status"],
        },
        TaskSaveError: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Failed to persist task data in database: connection timeout.",
            },
          },
          required: ["message"],
        },
        TaskNotFoundError: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Task with taskId 686a6e8ccb00ef45aea7d7c8 not found.",
            },
          },
          required: ["message"],
        },
        TaskRetrievalError: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example:
                "Failed to retrieve task with taskId 686a6e8ccb00ef45aea7d7c8 from database: connection timeout.",
            },
          },
          required: ["message"],
        },
        NoFileSelectedError: {
          type: "object",
          properties: {
            message: { type: "string", example: "No file path provided." },
          },
          required: ["message"],
        },
        InvalidFileExtensionError: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "File extension not allowed. Allowed extensions: .jpg, .jpeg, .png, .webp, .svg, .gif.",
            },
          },
          required: ["message"],
        },
      },
    },
  },
  apis: ["src/task/infrastructure/routes/*.ts"],
};

export default TaskSwaggerOptions;
