const { sequelize } = require("../config/db");
const QuizAttempt = require("../models/QuizAttempt");
const QuizItem = require("../models/QuizItem");
const UserWord = require("../models/UserWord");
const { Op } = require("sequelize");

/**
 * 1. Bắt đầu Quiz: Tạo Attempt và tạo sẵn các QuizItem
 */
const startQuiz = async (userId, count, wordTypes = []) => {
  const t = await sequelize.transaction();
  try {
    // Tạo điều kiện lọc
    const whereCondition = { user_id: userId };

    // Nếu người dùng chọn từ loại cụ thể (không phải "Chọn tất cả")
    if (wordTypes && wordTypes.length > 0) {
      whereCondition.word_type = { [Op.in]: wordTypes };
    }

    const wordsToReview = await UserWord.findAll({
      where: whereCondition,
      order: [["mastery_level", "ASC"], sequelize.literal("RAND()")],
      limit: count,
      transaction: t,
    });

    if (wordsToReview.length === 0) {
      await t.rollback();
      return {
        status: "Err",
        message: "Không tìm thấy từ vựng thuộc loại bạn đã chọn!",
      };
    }

    // ... (Phần tạo QuizAttempt và QuizItem giữ nguyên như cũ)
    const newAttempt = await QuizAttempt.create(
      {
        user_id: userId,
        total_questions: wordsToReview.length,
      },
      { transaction: t }
    );

    // Tạo các item câu hỏi
    const quizItemsData = wordsToReview.map((word) => ({
      attempt_id: newAttempt.id,
      user_word_id: word.id,
      question_text: word.vietnamese_meaning,
      correct_answer: word.english_word,
    }));

    const createdItems = await QuizItem.bulkCreate(quizItemsData, {
      transaction: t,
    });

    await t.commit();
    return {
      status: "Ok",
      data: {
        attempt_id: newAttempt.id,
        questions: createdItems.map((item) => ({
          id: item.id,
          vn_meaning: item.question_text,
          created_at: item.created_at,
        })),
      },
    };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

/**
 * 2. Nộp từng câu: Kiểm tra 15 giây và tính đúng/sai
 */
const submitAnswer = async (userId, itemId, userAnswer) => {
  const t = await sequelize.transaction();
  try {
    // Tìm câu hỏi và đảm bảo nó thuộc về user này
    const item = await QuizItem.findByPk(itemId, {
      include: [
        { model: QuizAttempt, as: "attempt", where: { user_id: userId } },
      ],
      transaction: t,
    });

    if (!item) {
      await t.rollback();
      return { status: "Err", message: "Không tìm thấy câu hỏi!" };
    }

    // --- LOGIC KIỂM TRA 15 GIÂY ---
    const now = new Date();
    const createdAt = new Date(item.created_at);
    const diffInSeconds = (now - createdAt) / 1000;

    let isCorrect = false;
    // Cho phép 17s (15s quy định + 2s bù trễ mạng)
    if (diffInSeconds <= 17) {
      const correctStr = item.correct_answer.trim().toLowerCase();
      const userStr = (userAnswer || "").trim().toLowerCase();
      if (userStr === correctStr) isCorrect = true;
    }

    // Cập nhật kết quả câu hỏi
    await item.update(
      {
        user_answer: userAnswer,
        is_correct: isCorrect,
        submitted_at: now,
      },
      { transaction: t }
    );

    // Cập nhật độ thành thạo của từ vựng (Mastery Level)
    const word = await UserWord.findByPk(item.user_word_id, { transaction: t });
    if (word) {
      if (isCorrect) {
        word.mastery_level += 1;
      } else {
        word.mastery_level = Math.max(0, word.mastery_level - 1);
      }
      word.last_reviewed_at = now;
      await word.save({ transaction: t });
    }

    await t.commit();
    return { status: "Ok", is_correct: isCorrect, time_spent: diffInSeconds };
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

/**
 * 3. Kết thúc Quiz: Tính điểm tổng kết
 */
const finishQuiz = async (userId, attemptId) => {
  try {
    const attempt = await QuizAttempt.findOne({
      where: { id: attemptId, user_id: userId },
      include: [{ model: QuizItem, as: "items" }],
    });

    if (!attempt)
      return { status: "Err", message: "Không tìm thấy lượt làm bài!" };

    // 1. Lấy danh sách các câu đã trả lời đúng
    const correctCount = attempt.items.filter((i) => i.is_correct).length;

    // 2. Tổng số câu hỏi trong bài
    const total = attempt.total_questions || attempt.items.length;

    // 3. Tính số câu sai
    const incorrectCount = total - correctCount;

    // 4. Tính điểm số (thang điểm 100)
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Cập nhật vào cơ sở dữ liệu
    await attempt.update({
      finished_at: new Date(),
      correct_count: correctCount,
      score: score,
    });

    return {
      status: "Ok",
      data: {
        score, // Ví dụ: 80
        correct_count: correctCount, // Ví dụ: 16
        incorrect_count: incorrectCount, // Ví dụ: 4 (Thêm mới)
        total_questions: total, // Ví dụ: 20
      },
    };
  } catch (e) {
    throw e;
  }
};

/**
 * 4. Lấy danh sách lịch sử làm bài (Phân trang)
 */
const getQuizHistory = async (userId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await QuizAttempt.findAndCountAll({
      where: {
        user_id: userId,
        finished_at: { [Op.ne]: null }, // Chỉ lấy bài đã hoàn thành
      },
      order: [["finished_at", "DESC"]],
      limit: limit,
      offset: offset,
    });

    return {
      status: "Ok",
      data: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        history: rows,
      },
    };
  } catch (e) {
    throw e;
  }
};

/**
 * 5. Xem chi tiết kết quả một bài kiểm tra cụ thể
 */
const getQuizDetail = async (userId, attemptId) => {
  try {
    const attempt = await QuizAttempt.findOne({
      where: { id: attemptId, user_id: userId },
      include: [
        {
          model: QuizItem,
          as: "items",
          attributes: [
            "id",
            "question_text",
            "correct_answer",
            "user_answer",
            "is_correct",
          ],
        },
      ],
    });

    if (!attempt)
      return { status: "Err", message: "Không tìm thấy bài kiểm tra!" };

    return {
      status: "Ok",
      data: attempt,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  startQuiz,
  submitAnswer,
  finishQuiz,
  getQuizHistory,
  getQuizDetail,
};
