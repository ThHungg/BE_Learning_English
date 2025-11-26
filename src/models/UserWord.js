const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UserWord = sequelize.define(
  "UserWord",
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
    english_word: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vietnamese_meaning: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mastery_level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_reviewed_at: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "user_words",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "english_word"],
      },
    ],
  }
);

module.exports = UserWord;
