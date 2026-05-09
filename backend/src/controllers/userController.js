const userService = require('../services/userService');

const listStudents = async (req, res) => {
  try {
    const students = await userService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const studentHistory = async (req, res) => {
  try {
    const history = await userService.getStudentHistory(req.params.id);
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await userService.updateStudentStatus(req.params.id, status);
    res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  listStudents,
  studentHistory,
  updateStatus,
};
