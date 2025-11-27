const attemptsService = require("../services/attemptsService");
const getAttemptDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { attemptId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: "Err",
        message: "User ID is required",
      });
    }
    if (!attemptId) {
      return res.status(400).json({
        status: "Err",
        message: "Attempt ID is required",
      });
    }

    const response = await attemptsService.getAttemptDetails(userId, attemptId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

const getAllTempts = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        status: "Err",
        message: "User ID is required",
      });
    }

    const response = await attemptsService.getAllTempts(userId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

module.exports = {
  getAttemptDetails,
  getAllTempts,
};
