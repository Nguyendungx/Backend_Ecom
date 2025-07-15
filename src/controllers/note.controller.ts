import { Request, Response } from 'express';
import Note from '../models/note.model';

export async function getAllNotes(req: Request, res: Response) {
  try {
    const notes = await Note.find().populate('user').populate('course');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getNoteById(req: Request, res: Response) {
  try {
    const note = await Note.findById(req.params.id).populate('user').populate('course');
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createNote(req: Request, res: Response) {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function updateNote(req: Request, res: Response) {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function deleteNote(req: Request, res: Response) {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 