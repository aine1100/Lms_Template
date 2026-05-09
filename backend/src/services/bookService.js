const { eq, and, desc } = require('drizzle-orm');
const { db } = require('../config/db');
const { books, transactions, users, notifications, reservations } = require('../models/schema');
const { sendNotification } = require('../utils/socket');
const { sendEmail } = require('../utils/email');

const createBook = async (bookData) => {
  const [newBook] = await db.insert(books).values(bookData).returning();
  return newBook;
};

const updateBook = async (id, updateData) => {
  const [updatedBook] = await db.update(books).set(updateData).where(eq(books.id, id)).returning();
  return updatedBook;
};

const deleteBook = async (id) => {
  await db.delete(books).where(eq(books.id, id));
  return true;
};

const getBooksReport = async () => {
  return await db.select().from(books);
};

const searchBooks = async (query) => {
  const { ilike, or } = require('drizzle-orm');
  const searchPattern = `%${query}%`;
  return await db.select().from(books).where(
    or(
      ilike(books.title, searchPattern),
      ilike(books.author, searchPattern),
      ilike(books.genre, searchPattern),
      ilike(books.isbn, searchPattern)
    )
  );
};

const lendBook = async (bookId, userId, days) => {
  // Check if book exists and is available
  const [book] = await db.select().from(books).where(eq(books.id, bookId));
  if (!book) throw new Error('Book not found');
  if (parseInt(book.availableQuantity) <= 0) throw new Error('Book not available for lending');

  // Check if user exists
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) throw new Error('User not found');

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + parseInt(days));

  // Create transaction
  const [transaction] = await db.insert(transactions).values({
    bookId,
    userId,
    dueDate,
  }).returning();

  // Update available quantity
  await db.update(books).set({
    availableQuantity: (parseInt(book.availableQuantity) - 1).toString()
  }).where(eq(books.id, bookId));

  // Create persistent notification
  await db.insert(notifications).values({
    userId,
    message: `You have borrowed "${book.title}". Due date: ${dueDate.toDateString()}`,
    type: 'Info'
  });

  // Real-time notification
  sendNotification(userId, `Book borrowed: ${book.title}`, 'Info');
  
  // Email Notification
  await sendEmail(user.email, 'Book Borrowed - LMS', `You borrowed "${book.title}". Please return by ${dueDate.toDateString()}.`);

  return transaction;
};

const returnBook = async (transactionId) => {
  const [transaction] = await db.select().from(transactions).where(eq(transactions.id, transactionId));
  if (!transaction) throw new Error('Transaction not found');
  if (transaction.status === 'Returned') throw new Error('Book already returned');

  const [book] = await db.select().from(books).where(eq(books.id, transaction.bookId));

  // Update transaction
  await db.update(transactions).set({
    returnDate: new Date(),
    status: 'Returned'
  }).where(eq(transactions.id, transactionId));

  // Update available quantity
  await db.update(books).set({
    availableQuantity: (parseInt(book.availableQuantity) + 1).toString()
  }).where(eq(books.id, transaction.bookId));

  const message = `Book "${book.title}" has been returned.`;
  await db.insert(notifications).values({ userId: transaction.userId, message, type: 'Info' });
  sendNotification(transaction.userId, message, 'Info');

  return true;
};

const reserveBook = async (bookId, userId) => {
  const [book] = await db.select().from(books).where(eq(books.id, bookId));
  if (!book) throw new Error('Book not found');
  if (parseInt(book.availableQuantity) > 0) throw new Error('Book is available, no need to reserve');

  const [existingRes] = await db.select().from(reservations).where(and(eq(reservations.bookId, bookId), eq(reservations.userId, userId), eq(reservations.status, 'Pending')));
  if (existingRes) throw new Error('You already have a pending reservation for this book');

  const [reservation] = await db.insert(reservations).values({
    bookId,
    userId,
  }).returning();

  const message = `You have reserved "${book.title}". We will notify you when it's available.`;
  await db.insert(notifications).values({ userId, message, type: 'Info' });
  sendNotification(userId, message, 'Info');

  return reservation;
};

const getBookLendHistory = async (bookId) => {
  return await db.select({
    transactionId: transactions.id,
    userName: users.name,
    userEmail: users.email,
    issueDate: transactions.issueDate,
    dueDate: transactions.dueDate,
    returnDate: transactions.returnDate,
    status: transactions.status
  })
  .from(transactions)
  .leftJoin(users, eq(transactions.userId, users.id))
  .where(eq(transactions.bookId, bookId))
  .orderBy(desc(transactions.issueDate));
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getBooksReport,
  searchBooks,
  lendBook,
  returnBook,
  reserveBook,
  getBookLendHistory,
};
