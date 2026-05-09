const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { eq, and } = require('drizzle-orm');
const { db } = require('../config/db');
const { users, otps } = require('../models/schema');
const { sendEmail } = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'supersecretrefreshkey';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const registerUser = async (name, email, password, role = 'Student') => {
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const [newUser] = await db.insert(users).values({
    name,
    email,
    passwordHash,
    role,
  }).returning();

  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await db.insert(otps).values({
    userId: newUser.id,
    otpCode,
    purpose: 'Verify_Email',
    expiresAt,
  });

  await sendEmail(email, 'Verify your Email - LMS', `Your OTP is: ${otpCode}`);

  return { id: newUser.id, name: newUser.name, email: newUser.email };
};

const verifyEmail = async (email, otpCode) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error('User not found');

  const [otpRecord] = await db.select().from(otps).where(and(eq(otps.userId, user.id), eq(otps.otpCode, otpCode), eq(otps.purpose, 'Verify_Email')));
  
  if (!otpRecord) throw new Error('Invalid OTP');
  if (new Date() > otpRecord.expiresAt) throw new Error('OTP expired');

  await db.update(users).set({ isVerified: true }).where(eq(users.id, user.id));
  await db.delete(otps).where(eq(otps.id, otpRecord.id));

  return true;
};

const loginUser = async (email, password) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Invalid credentials');

  if (!user.isVerified) throw new Error('Email not verified');
  if (user.status !== 'Active') throw new Error('Account is suspended');

  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken, user: { id: user.id, name: user.name, role: user.role } };
};

const forgotPassword = async (email) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error('User not found');

  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // Clear any existing reset OTPs for this user
  await db.delete(otps).where(and(eq(otps.userId, user.id), eq(otps.purpose, 'Reset_Password')));

  await db.insert(otps).values({
    userId: user.id,
    otpCode,
    purpose: 'Reset_Password',
    expiresAt,
  });

  await sendEmail(email, 'Password Reset - LMS', `Your password reset OTP is: ${otpCode}`);
  return true;
};

const resetPassword = async (email, otpCode, newPassword) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error('User not found');

  const [otpRecord] = await db.select().from(otps).where(and(eq(otps.userId, user.id), eq(otps.otpCode, otpCode), eq(otps.purpose, 'Reset_Password')));

  if (!otpRecord) throw new Error('Invalid OTP');
  if (new Date() > otpRecord.expiresAt) throw new Error('OTP expired');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
  await db.delete(otps).where(eq(otps.id, otpRecord.id));

  return true;
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
};
