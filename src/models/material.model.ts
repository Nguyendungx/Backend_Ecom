import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  description: string;
  fileUrl: string;
  course: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema: Schema = new Schema<IMaterial>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
}, { timestamps: true });

export default mongoose.model<IMaterial>('Material', MaterialSchema); 