import { Router } from "express";
import { getTask, createTask } from "../controllers/taskController";

const TaskRouter = Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: The path associated with the task
 *                 example: "/input/image1.png"
 *             required:
 *               - path
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskCreateResponse'
 *       400:
 *         description: Invalid or missing path
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/InvalidFileExtensionError'
 *                 - $ref: '#/components/schemas/NoFileSelectedError'
 *             examples:
 *               NoFileSelected:
 *                 summary: Missing path
 *                 value:
 *                   message: "No file path provided."
 *               InvalidFileExtension:
 *                 summary: Invalid file extension
 *                 value:
 *                   message: "File extension not allowed. Allowed extensions:.jpg, .jpeg, .png, .webp, .svg, .gif."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskSaveError'
 */
TaskRouter.post("/", createTask);
/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a task by taskId
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         example: "686b01ff3f2ed6fb5bb2ad24"
 *         required: true
 *         schema:
 *           type: string
 *         description: The taskId
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             examples:
 *               PendingTask:
 *                 summary: Pending task
 *                 value:
 *                   taskId: "686a6e8ccb00ef45aea7d7c8"
 *                   price: 50
 *                   status: "pending"
 *               FailedTask:
 *                 summary: Failed task
 *                 value:
 *                   taskId: "686a6e8ccb00ef45aea7d7c8"
 *                   price: 50
 *                   status: "failed"
 *               CompletedTask:
 *                 summary: Completed task
 *                 value:
 *                   taskId: "686a6e8ccb00ef45aea7d7c8"
 *                   price: 50
 *                   status: "completed"
 *                   images: [
 *                     { resolution: "800", path: "/output/image1/800/7a53928fa4dd31e82c6ef826f341daec.png" },
 *                     { resolution: "1024", path: "/output/image1/1024/021bbc7ee20b71134d53e20206bd6feb.png" }
 *                   ]
 *       404:
 *         description: Task not found error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskRetrievalError'
 */
TaskRouter.get("/:taskId", getTask);

export { TaskRouter };
