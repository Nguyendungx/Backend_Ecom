import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  course: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema<ICartItem>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const CartSchema: Schema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.model<ICart>('Cart', CartSchema); 