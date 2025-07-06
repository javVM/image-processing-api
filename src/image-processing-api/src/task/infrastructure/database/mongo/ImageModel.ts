import { Schema, Document, model, Types } from "mongoose";

export interface ImageDocument extends Document {
  _id: Types.ObjectId;
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
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ImageModel = model<ImageDocument>("Image", ImageSchema);
