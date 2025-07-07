import { ImageDocument } from "./ImageModel";
import "./ImageModel";
import { Schema, Document, Types, model } from "mongoose";
import { Status } from "../../../domain/entities/Status";

interface TaskDocument extends Document {
  _id: Types.ObjectId;
  status: Status;
  price: number;
  originalPath: string;
  images?: (Types.ObjectId | ImageDocument)[];
}

const TaskSchema = new Schema<TaskDocument>(
  {
    status: { type: String, enum: Object.values(Status), required: true },
    price: { type: Number, required: true },
    originalPath: { type: String, required: true },
    images: { type: [{ type: Schema.Types.ObjectId, ref: "Image" }], default: [] },
  },
  {  versionKey: false, timestamps: true }
);

export const TaskModel = model<TaskDocument>("Task", TaskSchema);
