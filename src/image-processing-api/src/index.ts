import express from "express";
import dotenv from "dotenv";
import { TaskRouter } from "./task/infrastructure/routes/taskRouter";
import { connectToDatabase } from "./task/infrastructure/database/mongo/mongoConnection";
import { errorHandler } from "./task/infrastructure/middlewares/errorHandler";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "local"}` });
const app = express();
app.use(express.json());
app.use("/tasks", TaskRouter);
app.use(errorHandler);

async function bootstrap() {
  try {
    await connectToDatabase();
    app.listen(process.env.PORT, () => {
      console.log(`Image processing API is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

bootstrap();
