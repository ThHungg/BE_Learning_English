const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { authenticateToken } = require("../middleware/auth");

router.post("/start", authenticateToken, quizController.startQuiz);
router.post("/submit", authenticateToken, quizController.submitQuiz);

module.exports = router;
