const { pgTable, uuid, varchar, text, timestamp, boolean } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('Student').notNull(), // 'Librarian' or 'Student'
  isVerified: boolean('is_verified').default(false).notNull(),
  status: varchar('status', { length: 50 }).default('Active').notNull(), // 'Active' or 'Suspended'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const otps = pgTable('otps', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  otpCode: varchar('otp_code', { length: 10 }).notNull(),
  purpose: varchar('purpose', { length: 50 }).notNull(), // 'Verify_Email' or 'Reset_Password'
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  isbn: varchar('isbn', { length: 50 }).notNull().unique(),
  genre: varchar('genre', { length: 100 }),
  publisher: varchar('publisher', { length: 255 }),
  totalQuantity: varchar('total_quantity').notNull().default('1'),
  availableQuantity: varchar('available_quantity').notNull().default('1'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').references(() => books.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  issueDate: timestamp('issue_date').defaultNow().notNull(),
  dueDate: timestamp('due_date').notNull(),
  returnDate: timestamp('return_date'),
  status: varchar('status', { length: 50 }).default('Borrowed').notNull(), // 'Borrowed', 'Returned', 'Overdue'
  fineAmount: varchar('fine_amount').default('0').notNull(),
});

const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'Info', 'Alert', 'DueSoon'
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const reservations = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').references(() => books.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  reservationDate: timestamp('reservation_date').defaultNow().notNull(),
  status: varchar('status', { length: 50 }).default('Pending').notNull(), // 'Pending', 'Fulfilled', 'Cancelled'
});

module.exports = {
  users,
  otps,
  books,
  transactions,
  notifications,
  reservations,
};
