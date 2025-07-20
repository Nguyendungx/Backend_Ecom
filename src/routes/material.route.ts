import { Router } from 'express';
import { getAllMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from '../controllers/material.controller';

const router = Router();

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Lấy danh sách tất cả tài liệu
 *     tags: [Material]
 *     responses:
 *       200:
 *         description: Danh sách tài liệu
 *   post:
 *     summary: Tạo tài liệu mới
 *     tags: [Material]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *               course:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Lỗi dữ liệu
 */
router.get('/', getAllMaterials);
router.post('/', createMaterial);

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Lấy thông tin tài liệu theo id
 *     tags: [Material]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin tài liệu
 *       404:
 *         description: Không tìm thấy
 *   put:
 *     summary: Cập nhật tài liệu theo id
 *     tags: [Material]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *               course:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi dữ liệu
 *       404:
 *         description: Không tìm thấy
 *   delete:
 *     summary: Xoá tài liệu theo id
 *     tags: [Material]
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
router.get('/:id', getMaterialById);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

export default router; 