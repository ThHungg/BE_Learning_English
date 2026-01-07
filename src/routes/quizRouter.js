const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { authenticateToken } = require("../middleware/auth");

// 1. Bắt đầu bài Quiz (Tạo Attempt và các Items)
router.post("/start", authenticateToken, quizController.startQuiz);

// 2. Nộp kết quả của TỪNG câu hỏi (Để kiểm tra mốc 15 giây)
// Thay vì dùng /submit, đặt tên /submit-answer sẽ rõ nghĩa hơn
router.post("/submit-answer", authenticateToken, quizController.submitAnswer);

// 3. Tổng kết bài Quiz (Tính điểm cuối cùng và trả về kết quả tổng quát)
router.get("/finish/:attempt_id", authenticateToken, quizController.finishQuiz);

router.get("/history", authenticateToken, quizController.getQuizHistory);
router.get(
  "/detail/:attempt_id",
  authenticateToken,
  quizController.getQuizDetail
);

module.exports = router;
