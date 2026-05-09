const { eq, desc } = require('drizzle-orm');
const { db } = require('../config/db');
const { users, transactions, books } = require('../models/schema');

const getAllStudents = async () => {
  return await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    status: users.status,
    isVerified: users.isVerified,
    createdAt: users.createdAt
  }).from(users).where(eq(users.role, 'Student'));
};

const getStudentHistory = async (userId) => {
  return await db.select({
    transactionId: transactions.id,
    bookTitle: books.title,
    issueDate: transactions.issueDate,
    dueDate: transactions.dueDate,
    returnDate: transactions.returnDate,
    status: transactions.status
  })
  .from(transactions)
  .leftJoin(books, eq(transactions.bookId, books.id))
  .where(eq(transactions.userId, userId))
  .orderBy(desc(transactions.issueDate));
};

const updateStudentStatus = async (userId, status) => {
  return await db.update(users).set({ status }).where(eq(users.id, userId)).returning();
};

module.exports = {
  getAllStudents,
  getStudentHistory,
  updateStudentStatus,
};
