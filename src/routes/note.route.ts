import { Router } from 'express';
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from '../controllers/note.controller';

const router = Router();

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router; 