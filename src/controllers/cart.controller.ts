import { Request, Response } from 'express';
import Cart from '../models/cart.model';

export async function getAllCarts(req: Request, res: Response) {
  try {
    const carts = await Cart.find().populate('user').populate('items.course');
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getCartById(req: Request, res: Response) {
  try {
    const cart = await Cart.findById(req.params.id).populate('user').populate('items.course');
    if (!cart) return res.status(404).json({ error: 'Not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createCart(req: Request, res: Response) {
  try {
    const cart = new Cart(req.body);
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function updateCart(req: Request, res: Response) {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cart) return res.status(404).json({ error: 'Not found' });
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function deleteCart(req: Request, res: Response) {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 