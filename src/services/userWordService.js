const UserWord = require("../models/Userword");

const addWord = async (english_word, vn_meaning, userId) => {
  try {
    const checkWord = await UserWord.findOne({
      where: { user_id: userId, english_word },
    });
    if (checkWord) {
      return {
        message: "Từ này đã có trong danh sách của bạn",
      };
    }
    const newWord = await UserWord.create({
      user_id: userId,
      english_word,
      vietnamese_meaning: vn_meaning,
    });
    return {
      message: "Thêm từ mới thành công",
      word: newWord,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    };
  }
};

const getUserWords = async (userId, limit, offset) => {
  try {
    console.log("userId", userId);
    const { rows, count } = await UserWord.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
    });
    return {
      message: "Lấy danh sách từ mới thành công",
      words: rows,
      totalWords: count,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    };
  }
};
const updateWord = async (wordId, english_word, vn_meaning, userId) => {
  try {
    const word = await UserWord.findOne({
      where: { id: wordId, user_id: userId },
    });
    if (!word) {
      return { message: "Từ không tồn tại trong danh sách của bạn" };
    }
    word.english_word = english_word;
    word.vietnamese_meaning = vn_meaning;
    await word.save();
    return {
      message: "Cập nhật từ mới thành công",
      word,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    };
  }
};

module.exports = {
  addWord,
  getUserWords,
  updateWord,
};
