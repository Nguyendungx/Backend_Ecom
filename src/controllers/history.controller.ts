import { Request, Response } from 'express';
import History from '../models/history.model';

export async function getAllHistories(req: Request, res: Response) {
  try {
    const histories = await History.find().populate('user').populate('course');
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getHistoryById(req: Request, res: Response) {
  try {
    const history = await History.findById(req.params.id).populate('user').populate('course');
    if (!history) return res.status(404).json({ error: 'Not found' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createHistory(req: Request, res: Response) {
  try {
    const history = new History(req.body);
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function updateHistory(req: Request, res: Response) {
  try {
    const history = await History.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!history) return res.status(404).json({ error: 'Not found' });
    res.json(history);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function deleteHistory(req: Request, res: Response) {
  try {
    const history = await History.findByIdAndDelete(req.params.id);
    if (!history) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 