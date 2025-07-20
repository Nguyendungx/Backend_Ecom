import { Router } from 'express';
import { getAllComments, getCommentById, createComment, updateComment, deleteComment } from '../controllers/comment.controller';

const router = Router();

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Lấy danh sách tất cả bình luận
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: Danh sách bình luận
 *   post:
 *     summary: Tạo bình luận mới
 *     tags: [Comment]
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
 *               lesson:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Lỗi dữ liệu
 */
router.get('/', getAllComments);
router.post('/', createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Lấy thông tin bình luận theo id
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin bình luận
 *       404:
 *         description: Không tìm thấy
 *   put:
 *     summary: Cập nhật bình luận theo id
 *     tags: [Comment]
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
 *               lesson:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi dữ liệu
 *       404:
 *         description: Không tìm thấy
 *   delete:
 *     summary: Xoá bình luận theo id
 *     tags: [Comment]
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
router.get('/:id', getCommentById);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router; 