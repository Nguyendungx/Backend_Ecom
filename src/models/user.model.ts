import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  favorites: mongoose.Types.ObjectId[];
  history: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  history: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password as string, 10);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password as string);
};

export default mongoose.model<IUserDocument>('User', UserSchema); 