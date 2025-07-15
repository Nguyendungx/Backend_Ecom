import { Request, Response } from 'express';
import Comment from '../models/comment.model';

export async function getAllComments(req: Request, res: Response) {
  try {
    const comments = await Comment.find().populate('user').populate('course');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getCommentById(req: Request, res: Response) {
  try {
    const comment = await Comment.findById(req.params.id).populate('user').populate('course');
    if (!comment) return res.status(404).json({ error: 'Not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createComment(req: Request, res: Response) {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function updateComment(req: Request, res: Response) {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comment) return res.status(404).json({ error: 'Not found' });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 