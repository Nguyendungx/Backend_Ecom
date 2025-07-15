import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IEvent>('Event', EventSchema); 