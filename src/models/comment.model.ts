import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  lesson: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IComment>('Comment', CommentSchema); 