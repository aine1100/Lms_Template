const { eq, desc, ilike, or, and } = require('drizzle-orm');
const { db } = require('../config/db');
const { users, transactions, books, notifications } = require('../models/schema');

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

const searchStudents = async (query) => {
  const searchPattern = `%${query}%`;
  return await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    status: users.status
  })
  .from(users)
  .where(
    and(
      eq(users.role, 'Student'),
      or(
        ilike(users.name, searchPattern),
        ilike(users.email, searchPattern)
      )
    )
  );
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

const getNotifications = async (userId) => {
  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
};

const markNotificationRead = async (id) => {
  return await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
};

module.exports = {
  getAllStudents,
  searchStudents,
  getStudentHistory,
  updateStudentStatus,
  getNotifications,
  markNotificationRead,
};
