const express = require("express");
const router = express.Router();
const userWordController = require("../controllers/userWordController");
const { authenticateToken } = require("../middleware/auth");
// Thêm từ mới vào danh sách
router.post("/words", authenticateToken, userWordController.addWord);
router.get("/words", authenticateToken, userWordController.getUserWords);
router.put("/words/:id", authenticateToken, userWordController.updateWord);

module.exports = router;
