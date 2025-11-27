const quizService = require("../services/quizService");

const startQuiz = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = parseInt(req.body.count) || 10;

    if (!userId) {
      return res.status(400).json({
        status: "Err",
        message: "User ID is required",
      });
    }

    const response = await quizService.startQuiz(userId, count);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { attempt_id, answers } = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "Err",
        message: "User ID is required",
      });
    }
    if (!attempt_id || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        status: "Err",
        message: "Vui lòng cung cấp đầy đủ thông tin nộp bài kiểm tra",
      });
    }

    const response = await quizService.submitQuiz(userId, attempt_id, answers);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

module.exports = {
  startQuiz,
  submitQuiz,
};
