import { Schema, Document, model } from "mongoose";

export interface ImageDocument extends Document {
  _id: string;
  path: string;
  resolution: string;
  md5: string;
}

const ImageSchema = new Schema<ImageDocument>(
  {
    path: { type: String, required: true },
    resolution: { type: String, required: true },
    md5: { type: String, required: true },
  },
  { timestamps: true }
);

export const ImageModel = model<ImageDocument>("Image", ImageSchema);
