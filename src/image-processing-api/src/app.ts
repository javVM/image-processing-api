import express from "express";
import { TaskRouter } from "./task/infrastructure/routes/taskRouter";
import { errorHandler } from "./task/infrastructure/middlewares/errorHandler";
import TaskSwaggerOptions from "./task/infrastructure/config/swagger";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();

app.use(express.json());

const swaggerSpec = swaggerJSDoc(TaskSwaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/tasks", TaskRouter);

app.use(errorHandler);

export default app;
