import express from "express";
import dotenv from "dotenv";
import { TaskRouter } from "./task/infrastructure/routes/taskRouter";
import { connectToDatabase } from "./task/infrastructure/database/mongo/mongoConnection";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "local"}` });
const app = express();
app.use(express.json());
app.use("/tasks", TaskRouter);

async function bootstrap() {
  await connectToDatabase();
  app.listen(process.env.PORT, () => {
    console.log(`Image processing API is running on port ${process.env.PORT}`);
  });
}

bootstrap();
