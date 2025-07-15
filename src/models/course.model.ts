import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  price: number;
  image: string;
  lessons: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  lessons: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema); 