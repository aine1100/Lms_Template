const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../utils/authMiddleware');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/users/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/notifications', userController.getNotifications);

/**
 * @swagger
 * /api/users/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.put('/notifications/:id/read', userController.markNotificationRead);

// Librarian specific routes
router.get('/students', authorize('Librarian'), userController.listStudents);
router.get('/students/:id/history', authorize('Librarian'), userController.studentHistory);
router.put('/students/:id/status', authorize('Librarian'), userController.updateStatus);

module.exports = router;
