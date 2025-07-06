import { connect } from "mongoose";

export async function connectToDatabase() {
  await connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DATABASE}`);
  console.log("Database connected");
}
