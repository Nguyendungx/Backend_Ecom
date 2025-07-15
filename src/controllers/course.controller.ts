import { Request, Response } from 'express';
import Course from '../models/course.model';

export async function getAllCourses(req: Request, res: Response) {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getCourseById(req: Request, res: Response) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createCourse(req: Request, res: Response) {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function updateCourse(req: Request, res: Response) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ error: 'Not found' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}

export async function deleteCourse(req: Request, res: Response) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
} 