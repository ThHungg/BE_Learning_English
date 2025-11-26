const User = require("./User");
const UserWord = require("./Userword");
const QuizAttempt = require("./QuizAttempt");
const QuizItem = require("./QuizItem");

// 1. User <-> UserWord (1:N)
User.hasMany(UserWord, { foreignKey: "user_id", as: "userWords" });
UserWord.belongsTo(User, { foreignKey: "user_id", as: "owner" });

// 2. User <-> QuizAttempt (1:N)
User.hasMany(QuizAttempt, { foreignKey: "user_id", as: "quizAttempts" });
QuizAttempt.belongsTo(User, { foreignKey: "user_id", as: "tester" });

// 3. QuizAttempt <-> QuizItem (1:N)
QuizAttempt.hasMany(QuizItem, { foreignKey: "attempt_id", as: "items" });
QuizItem.belongsTo(QuizAttempt, { foreignKey: "attempt_id", as: "attempt" });

// 4. UserWord <-> QuizItem (1:N)
UserWord.hasMany(QuizItem, {
  foreignKey: "user_word_id",
  as: "quizReferences",
});
QuizItem.belongsTo(UserWord, { foreignKey: "user_word_id", as: "testedWord" });
