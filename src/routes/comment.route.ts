import { Router } from 'express';
import { getAllComments, getCommentById, createComment, updateComment, deleteComment } from '../controllers/comment.controller';

const router = Router();

router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router; 