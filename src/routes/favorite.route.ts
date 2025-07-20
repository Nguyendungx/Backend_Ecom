import { Router } from 'express';
import { getAllFavorites, getFavoriteById, createFavorite, updateFavorite, deleteFavorite } from '../controllers/favorite.controller';

const router = Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Lấy danh sách tất cả yêu thích
 *     tags: [Favorite]
 *     responses:
 *       200:
 *         description: Danh sách yêu thích
 *   post:
 *     summary: Tạo yêu thích mới
 *     tags: [Favorite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               course:
 *                 type: string
 *               favoritedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Lỗi dữ liệu
 */
router.get('/', getAllFavorites);
router.post('/', createFavorite);

/**
 * @swagger
 * /api/favorites/{id}:
 *   get:
 *     summary: Lấy thông tin yêu thích theo id
 *     tags: [Favorite]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin yêu thích
 *       404:
 *         description: Không tìm thấy
 *   put:
 *     summary: Cập nhật yêu thích theo id
 *     tags: [Favorite]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               course:
 *                 type: string
 *               favoritedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi dữ liệu
 *       404:
 *         description: Không tìm thấy
 *   delete:
 *     summary: Xoá yêu thích theo id
 *     tags: [Favorite]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá thành công
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', getFavoriteById);
router.put('/:id', updateFavorite);
router.delete('/:id', deleteFavorite);

export default router; 