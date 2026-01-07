const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const QuizItem = sequelize.define(
  "QuizItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attempt_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_word_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_answer: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Nên mặc định là false thay vì null
    },
    // --- THÊM 2 TRƯỜNG NÀY ---
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "quiz_items",
    timestamps: false,
  }
);

module.exports = QuizItem;
