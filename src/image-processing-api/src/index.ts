import express from "express";
import { TaskRouter } from "./task/infrastructure/routes/taskRouter";
import { connectToDatabase } from "./task/infrastructure/database/mongo/mongoConnection";

const app = express();
app.use(express.json());
app.use("/tasks", TaskRouter);

async function bootstrap() {
  await connectToDatabase();
  app.listen(3000, () => {
    console.log("Image processing API is running on port 3000");
  });
}

bootstrap();
