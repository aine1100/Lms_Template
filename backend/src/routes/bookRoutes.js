const express = require('express');
const bookController = require('../controllers/bookController');
const { authenticate, authorize } = require('../utils/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search for books (Public/Student)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching books
 */
router.get('/search', bookController.search);

// All these routes require authentication
router.use(authenticate);

// Librarian specific routes
router.post('/lend', authorize('Librarian'), bookController.lend);
router.post('/return', authorize('Librarian'), bookController.returnBook);

/**
 * @swagger
 * /api/books/reserve:
 *   post:
 *     summary: Reserve an out-of-stock book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId]
 *             properties:
 *               bookId: { type: string }
 *     responses:
 *       201:
 *         description: Book reserved successfully
 */
router.post('/reserve', bookController.reserve);

/**
 * @swagger
 * /api/books/{id}/history:
 *   get:
 *     summary: Get lending history of a specific book
 *     tags: [Books]
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
 *         description: Book lending history
 */
router.get('/:id/history', authorize('Librarian'), bookController.history);

// CRUD routes (Librarian only)
router.use(authorize('Librarian'));

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author, isbn]
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               isbn: { type: string }
 *               genre: { type: string }
 *               publisher: { type: string }
 *               totalQuantity: { type: string, default: "1" }
 *               availableQuantity: { type: string, default: "1" }
 *     responses:
 *       201:
 *         description: Book created successfully
 */
router.post('/', bookController.create);

/**
 * @swagger
 * /api/books/report:
 *   get:
 *     summary: Get all books report
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all books
 */
router.get('/report', bookController.report);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
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
 *               title: { type: string }
 *               author: { type: string }
 *               genre: { type: string }
 *               totalQuantity: { type: string }
 *               availableQuantity: { type: string }
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
router.put('/:id', bookController.update);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
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
 *         description: Book deleted successfully
 */
router.delete('/:id', bookController.remove);

module.exports = router;
