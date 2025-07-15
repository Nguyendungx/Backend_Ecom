import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  favoritedAt: Date;
}

const FavoriteSchema: Schema = new Schema<IFavorite>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  favoritedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema); 