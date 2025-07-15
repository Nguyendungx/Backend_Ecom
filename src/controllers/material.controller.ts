import { Request, Response } from 'express';
import Material from '../models/material.model';

export async function getAllMaterials(req: Request, res: Response) {
  try {
    const materials = await Material.find().populate('course');
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getMaterialById(req: Request, res: Response) {
  try {
    const material = await Material.findById(req.params.id).populate('course');
    if (!material) return res.status(404).json({ error: 'Not found' });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createMaterial(req: Request, res: Response) {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function updateMaterial(req: Request, res: Response) {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ error: 'Not found' });
    res.json(material);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function deleteMaterial(req: Request, res: Response) {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 