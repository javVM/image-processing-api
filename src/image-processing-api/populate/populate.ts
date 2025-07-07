import mongoose from "mongoose";
import dotenv from "dotenv";
import { TaskModel } from "../src/task/infrastructure/database/mongo/TaskModel";
import { ImageModel } from "../src/task/infrastructure/database/mongo/ImageModel";
import path from "path";

async function populate() {
  try {
    const images = require(path.join(process.cwd(), "/data/images.json"));
    const tasks = require(path.join(process.cwd(), "/data/tasks.json"));

    dotenv.config({ path: `.env.local` });

    const MONGODB_URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DATABASE}`;
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Promise.all([ImageModel.deleteMany({}), TaskModel.deleteMany({})]);
    await Promise.all([ImageModel.insertMany(images), TaskModel.insertMany(tasks)]);

    console.log("Database populated!");
    process.exit(0);
  } catch (err) {
    console.error("Error populating database:", err);
    process.exit(1);
  }
}

populate();
