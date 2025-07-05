import { connect } from "mongoose";

export async function connectToDatabase() {
  await connect("mongodb://localhost:27017");
  console.log("Database connected");
}
