import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface AuthRequest extends Request {
  user?: IUserDocument;
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }) as IUserDocument;
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function me(req: AuthRequest, res: Response) {
  res.json({ user: req.user });
} 