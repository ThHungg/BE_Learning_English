const express = require("express");
const router = express.Router();
const quizController = require("../controllers/attemptsController");
const { authenticateToken } = require("../middleware/auth");

router.get("/:attemptId", authenticateToken, quizController.getAttemptDetails);
router.get("/", authenticateToken, quizController.getAllTempts);

module.exports = router;
