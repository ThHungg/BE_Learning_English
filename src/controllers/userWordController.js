const userWordService = require("../services/userWordService");

const addWord = async (req, res) => {
  try {
    const { english_word, vn_meaning, word_type } = req.body;
    const userId = req.user.id;
    if (!english_word || !vn_meaning) {
      return res.status(400).json({
        status: "Err",
        message: "Vui lòng cung cấp đầy đủ thông tin từ mới",
      });
    }
    const response = await userWordService.addWord(
      english_word,
      vn_meaning,
      word_type,
      userId
    );
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

const getUserWords = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    if (!userId) {
      return res.status(400).json({
        status: "Err",
        message: "User ID is required",
      });
    }

    const response = await userWordService.getUserWords(
      userId,
      limit,
      offset,
      page
    );
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

const updateWord = async (req, res) => {
  try {
    const { wordId } = req.params;
    const { english_word, vn_meaning } = req.body;
    const userId = req.user.id;

    if (!english_word || !vn_meaning) {
      return res.status(400).json({
        status: "Err",
        message: "Vui lòng cung cấp đầy đủ thông tin từ mới",
      });
    }

    const response = await userWordService.updateWord(
      wordId,
      english_word,
      vn_meaning,
      userId,
      page,
      limit
    );
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

const deleteWord = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user.id;

    if (!wordId) {
      return res.status(400).json({
        status: "Err",
        message: "Word ID is required",
      });
    }
    const response = await userWordService.deleteWord(wordId, userId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

module.exports = {
  addWord,
  getUserWords,
  updateWord,
  deleteWord,
};
