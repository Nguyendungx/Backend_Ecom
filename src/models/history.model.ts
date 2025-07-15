import mongoose, { Schema, Document } from 'mongoose';

export interface IHistory extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  viewedAt: Date;
}

const HistorySchema: Schema = new Schema<IHistory>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  viewedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IHistory>('History', HistorySchema); 