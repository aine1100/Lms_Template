const bookService = require('../services/bookService');

const create = async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const report = async (req, res) => {
  try {
    const books = await bookService.getBooksReport();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query is required' });
    const results = await bookService.searchBooks(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const lend = async (req, res) => {
  try {
    const { bookId, userId, days } = req.body;
    if (!bookId || !userId || !days) {
      return res.status(400).json({ message: 'bookId, userId, and days are required' });
    }
    const transaction = await bookService.lendBook(bookId, userId, days);
    res.status(201).json({ message: 'Book lent successfully', transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) return res.status(400).json({ message: 'transactionId is required' });
    await bookService.returnBook(transactionId);
    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const reserve = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id; // From authenticate middleware
    const reservation = await bookService.reserveBook(bookId, userId);
    res.status(201).json({ message: 'Book reserved successfully', reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const history = async (req, res) => {
  try {
    const history = await bookService.getBookLendHistory(req.params.id);
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const activity = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const activityData = await bookService.getActivityData(parseInt(days));
    res.status(200).json(activityData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBorrowedBooks = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Student email is required' });
    const result = await bookService.getStudentBorrowedBooks(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const returnByEmail = async (req, res) => {
  try {
    const { studentEmail, bookId } = req.body;
    if (!studentEmail || !bookId) {
      return res.status(400).json({ message: 'studentEmail and bookId are required' });
    }
    await bookService.returnBookByStudentEmail(studentEmail, bookId);
    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyBorrowedBooks = async (req, res) => {
  try {
    const userEmail = req.user.email; // From authenticate middleware
    const result = await bookService.getStudentBorrowedBooks(userEmail);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  create,
  update,
  remove,
  report,
  search,
  lend,
  returnBook,
  reserve,
  history,
  activity,
  getBorrowedBooks,
  returnByEmail,
  getMyBorrowedBooks,
};
