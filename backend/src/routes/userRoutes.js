const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../utils/authMiddleware');

const router = express.Router();

router.use(authenticate);
router.use(authorize('Librarian'));

/**
 * @swagger
 * /api/users/students:
 *   get:
 *     summary: List all students
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 */
router.get('/students', userController.listStudents);

/**
 * @swagger
 * /api/users/students/{id}/history:
 *   get:
 *     summary: Get student borrowing history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student borrowing history
 */
router.get('/students/:id/history', userController.studentHistory);

/**
 * @swagger
 * /api/users/students/{id}/status:
 *   put:
 *     summary: Update student account status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *               status: { type: string, enum: [Active, Suspended] }
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put('/students/:id/status', userController.updateStatus);

module.exports = router;
