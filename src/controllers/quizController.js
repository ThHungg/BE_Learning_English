const quizService = require("../services/quizService");

const startQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { count, wordTypes } = req.body; // wordTypes là mảng ví dụ: ['noun', 'verb']

    const response = await quizService.startQuiz(
      userId,
      parseInt(count),
      wordTypes
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// ĐỔI submitQuiz THÀNH submitAnswer (Nộp từng câu)
const submitAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    // item_id là ID của câu hỏi trong bảng quiz_items
    const { item_id, user_answer } = req.body;

    if (!item_id) {
      return res.status(400).json({
        status: "Err",
        message: "Thiếu ID câu hỏi (item_id)",
      });
    }

    const response = await quizService.submitAnswer(
      userId,
      item_id,
      user_answer
    );
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "Err", message: "Lỗi khi nộp câu trả lời" });
  }
};

// THÊM API TỔNG KẾT (Khi làm xong hết các câu)
const finishQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { attempt_id } = req.params;

    const response = await quizService.finishQuiz(userId, attempt_id);
    return res.status(200).json(response);
  } catch (e) {
    return res
      .status(500)
      .json({ status: "Err", message: "Lỗi khi tổng kết bài kiểm tra" });
  }
};

const getQuizHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const response = await quizService.getQuizHistory(
      userId,
      parseInt(page) || 1,
      parseInt(limit) || 10
    );
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

const getQuizDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { attempt_id } = req.params;
    const response = await quizService.getQuizDetail(userId, attempt_id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

module.exports = {
  startQuiz,
  submitAnswer,
  finishQuiz,
  getQuizHistory, // Thêm mới
  getQuizDetail, // Thêm mới
};
