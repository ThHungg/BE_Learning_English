const { Sequelize } = require("sequelize");
const UserWord = require("../models/UserWord");

const addWord = async (english_word, vn_meaning, word_type, userId) => {
  try {
    const checkWord = await UserWord.findOne({
      where: { user_id: userId, english_word },
    });
    if (checkWord) {
      return {
        status: "Err",
        message: "Từ này đã có trong danh sách của bạn",
      };
    }
    const newWord = await UserWord.create({
      user_id: userId,
      english_word,
      word_type,
      vietnamese_meaning: vn_meaning,
    });
    return {
      status: "Ok",
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

const getUserWords = async (userId, limit, offset, page) => {
  try {
    const { rows, count } = await UserWord.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [["id", "DESC"]], // Sắp xếp từ mới nhất
    });
    const totalPage = Math.ceil(count / limit);
    return {
      status: "Ok",
      message: "Lấy danh sách từ mới thành công",
      words: rows,
      totalWords: count,
      offset,
      page,
      totalPage,
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
      status: "Ok",
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

const deleteWord = async (wordId, userId) => {
  try {
    const word = await UserWord.findOne({
      where: { id: wordId, user_id: userId },
    });
    if (!word) {
      return {
        status: "Err",
        message: "Từ không tồn tại trong danh sách của bạn",
      };
    }
    await word.destroy();
    return {
      status: "Ok",
      message: "Xóa từ mới thành công",
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    };
  }
};

const getWordTypeStats = async (userId) => {
  try {
    const stats = await UserWord.findAll({
      where: { user_id: userId },
      attributes: [
        "word_type",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: ["word_type"],
      raw: true,
    });

    const formattedStats = stats.reduce((acc, curr) => {
      acc[curr.word_type] = parseInt(curr.count);
      return acc;
    }, {});

    return {
      status: "Ok",
      message: "Thống kê từ loại thành công",
      data: formattedStats,
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
  deleteWord,
  getWordTypeStats,
};
