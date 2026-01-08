const express = require("express");
const router = express.Router();
const userWordController = require("../controllers/userWordController");
const { authenticateToken } = require("../middleware/auth");

router.post("/words", authenticateToken, userWordController.addWord);
router.get("/words", authenticateToken, userWordController.getUserWords);
router.put("/words/:wordId", authenticateToken, userWordController.updateWord);
router.delete(
  "/words/:wordId",
  authenticateToken,
  userWordController.deleteWord
);
router.get("/stats", authenticateToken, userWordController.getWordTypeStats);

module.exports = router;
