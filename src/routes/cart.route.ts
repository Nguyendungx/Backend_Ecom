import { Router } from 'express';
import { getAllCarts, getCartById, createCart, updateCart, deleteCart } from '../controllers/cart.controller';

const router = Router();

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Lấy danh sách tất cả giỏ hàng
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Danh sách giỏ hàng
 *   post:
 *     summary: Tạo giỏ hàng mới
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     course:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Lỗi dữ liệu
 */
router.get('/', getAllCarts);
router.post('/', createCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Lấy thông tin giỏ hàng theo id
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin giỏ hàng
 *       404:
 *         description: Không tìm thấy
 *   put:
 *     summary: Cập nhật giỏ hàng theo id
 *     tags: [Cart]
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
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     course:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi dữ liệu
 *       404:
 *         description: Không tìm thấy
 *   delete:
 *     summary: Xoá giỏ hàng theo id
 *     tags: [Cart]
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
router.get('/:id', getCartById);
router.put('/:id', updateCart);
router.delete('/:id', deleteCart);

export default router; 