import { Router } from 'express';
import { getAllHistories, getHistoryById, createHistory, updateHistory, deleteHistory } from '../controllers/history.controller';

const router = Router();

router.get('/', getAllHistories);
router.get('/:id', getHistoryById);
router.post('/', createHistory);
router.put('/:id', updateHistory);
router.delete('/:id', deleteHistory);

export default router; 