import { Request, Response } from 'express';
import Post from '../models/post.model';

export async function getAllPosts(req: Request, res: Response) {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 