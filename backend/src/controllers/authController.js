const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await authService.registerUser(name, email, password, role);
    res.status(201).json({ message: 'User registered. Please check your email for OTP.', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verify = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
      return res.status(400).json({ message: 'Email and OTP code are required' });
    }
    await authService.verifyEmail(email, otpCode);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const data = await authService.loginUser(email, password);
    res.status(200).json({ message: 'Login successful', ...data });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    await authService.forgotPassword(email);
    res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    await authService.resetPassword(email, otpCode, newPassword);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  verify,
  login,
  forgotPassword,
  resetPassword,
};
