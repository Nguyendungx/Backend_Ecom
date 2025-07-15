import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  tags: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String },
}, { timestamps: true });

export default mongoose.model<IPost>('Post', PostSchema); 