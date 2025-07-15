import { Request, Response } from 'express';
import Event from '../models/event.model';

export async function getAllEvents(req: Request, res: Response) {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getEventById(req: Request, res: Response) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createEvent(req: Request, res: Response) {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 