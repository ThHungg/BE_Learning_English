const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const QuizAttempt = sequelize.define(
  "QuizAttempt",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    finished_at: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    total_questions: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Thay đổi: Mặc định 0
    },
    correct_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Thay đổi: Mặc định 0
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0, // Thay đổi: Mặc định 0
    },
  },
  {
    tableName: "quiz_attempts",
    timestamps: false,
  }
);

module.exports = QuizAttempt;
