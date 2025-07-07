import mongoose from "mongoose";
import dotenv from "dotenv";
import { TaskModel } from "../src/task/infrastructure/database/mongo/TaskModel";
import { ImageModel } from "../src/task/infrastructure/database/mongo/ImageModel";

async function populate() {
  try {
    const images = require("./data/images.json");
    const tasks = require("./data/tasks.json");

    dotenv.config({ path: `.env.${process.env.NODE_ENV || "local"}` });

    const MONGODB_URI = `mongodb://localhost:${process.env.MONGO_PORT}/${process.env.DATABASE}`;
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Promise.all([ImageModel.deleteMany({}),TaskModel.deleteMany({})]);
    await Promise.all([ImageModel.insertMany(images),TaskModel.insertMany(tasks)]);

    console.log("Database populated!");
    process.exit(0);
  } catch (err) {
    console.error("Error populating database:", err);
    process.exit(1);
  }
}

populate();
