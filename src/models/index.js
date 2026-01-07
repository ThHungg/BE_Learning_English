const User = require("./User");
const UserWord = require("./UserWord");
const QuizAttempt = require("./QuizAttempt");
const QuizItem = require("./QuizItem");

// --- Quan hệ User & UserWord ---
User.hasMany(UserWord, {
  foreignKey: "user_id",
  as: "userWords",
  onDelete: "CASCADE",
});
UserWord.belongsTo(User, { foreignKey: "user_id", as: "owner" });

// --- Quan hệ User & QuizAttempt ---
User.hasMany(QuizAttempt, {
  foreignKey: "user_id",
  as: "quizAttempts",
  onDelete: "CASCADE",
});
QuizAttempt.belongsTo(User, { foreignKey: "user_id", as: "tester" });

// --- Quan hệ QuizAttempt & QuizItem ---
// Khi xóa 1 lượt Quiz, toàn bộ câu hỏi trong lượt đó phải bị xóa (CASCADE)
QuizAttempt.hasMany(QuizItem, {
  foreignKey: "attempt_id",
  as: "items",
  onDelete: "CASCADE",
});
QuizItem.belongsTo(QuizAttempt, { foreignKey: "attempt_id", as: "attempt" });

// --- Quan hệ UserWord & QuizItem ---
// Chú ý: Dùng RESTRICT để không cho phép xóa từ vựng nếu nó đang nằm trong 1 bài Quiz đã làm
UserWord.hasMany(QuizItem, {
  foreignKey: "user_word_id",
  as: "quizReferences",
});
QuizItem.belongsTo(UserWord, {
  foreignKey: "user_word_id",
  as: "testedWord",
  onDelete: "RESTRICT",
});

module.exports = {
  User,
  UserWord,
  QuizAttempt,
  QuizItem,
};
