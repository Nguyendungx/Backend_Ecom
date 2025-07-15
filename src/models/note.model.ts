import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  lesson: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<INote>('Note', NoteSchema); 