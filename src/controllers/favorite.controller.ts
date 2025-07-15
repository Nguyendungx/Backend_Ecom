import { Request, Response } from 'express';
import Favorite from '../models/favorite.model';

export async function getAllFavorites(req: Request, res: Response) {
  try {
    const favorites = await Favorite.find().populate('user').populate('course');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getFavoriteById(req: Request, res: Response) {
  try {
    const favorite = await Favorite.findById(req.params.id).populate('user').populate('course');
    if (!favorite) return res.status(404).json({ error: 'Not found' });
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createFavorite(req: Request, res: Response) {
  try {
    const favorite = new Favorite(req.body);
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function updateFavorite(req: Request, res: Response) {
  try {
    const favorite = await Favorite.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!favorite) return res.status(404).json({ error: 'Not found' });
    res.json(favorite);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function deleteFavorite(req: Request, res: Response) {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 