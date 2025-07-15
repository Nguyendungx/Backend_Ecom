import { Router } from 'express';
import { getAllFavorites, getFavoriteById, createFavorite, updateFavorite, deleteFavorite } from '../controllers/favorite.controller';

const router = Router();

router.get('/', getAllFavorites);
router.get('/:id', getFavoriteById);
router.post('/', createFavorite);
router.put('/:id', updateFavorite);
router.delete('/:id', deleteFavorite);

export default router; 