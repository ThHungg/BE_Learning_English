const User = require("./User");
const UserWord = require("./Userword");
const QuizAttempt = require("./QuizAttempt");
const QuizItem = require("./QuizItem");

User.hasMany(UserWord, { foreignKey: "user_id", as: "userWords" });
UserWord.belongsTo(User, { foreignKey: "user_id", as: "owner" });

User.hasMany(QuizAttempt, { foreignKey: "user_id", as: "quizAttempts" });
QuizAttempt.belongsTo(User, { foreignKey: "user_id", as: "tester" });

QuizAttempt.hasMany(QuizItem, { foreignKey: "attempt_id", as: "items" });
QuizItem.belongsTo(QuizAttempt, { foreignKey: "attempt_id", as: "attempt" });

UserWord.hasMany(QuizItem, {
  foreignKey: "user_word_id",
  as: "quizReferences",
});
QuizItem.belongsTo(UserWord, { foreignKey: "user_word_id", as: "testedWord" });

module.exports = {
  User,
  UserWord,
  QuizAttempt,
  QuizItem,
};
