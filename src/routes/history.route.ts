import { Router } from 'express';
import { getAllHistories, getHistoryById, createHistory, updateHistory, deleteHistory } from '../controllers/history.controller';

const router = Router();

/**
 * @swagger
 * /api/histories:
 *   get:
 *     summary: Lấy danh sách tất cả lịch sử
 *     tags: [History]
 *     responses:
 *       200:
 *         description: Danh sách lịch sử
 *   post:
 *     summary: Tạo lịch sử mới
 *     tags: [History]
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
 *               viewedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Lỗi dữ liệu
 */
router.get('/', getAllHistories);
router.post('/', createHistory);

/**
 * @swagger
 * /api/histories/{id}:
 *   get:
 *     summary: Lấy thông tin lịch sử theo id
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin lịch sử
 *       404:
 *         description: Không tìm thấy
 *   put:
 *     summary: Cập nhật lịch sử theo id
 *     tags: [History]
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
 *               viewedAt:
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
 *     summary: Xoá lịch sử theo id
 *     tags: [History]
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
router.get('/:id', getHistoryById);
router.put('/:id', updateHistory);
router.delete('/:id', deleteHistory);

export default router; 