const { sequelize } = require("../config/db");
const QuizAttempt = require("../models/QuizAttempt");
const QuizItem = require("../models/QuizItem");
const UserWord = require("../models/Userword");

const startQuiz = async (userId, count) => {
  const t = await sequelize.transaction();
  try {
    const wordsToReview = await UserWord.findAll({
      where: { user_id: userId },
      order: [
        ["mastery_level", "ASC"],
        ["last_reviewed_at", "ASC"],
        sequelize.literal("RAND()"),
      ],
      limit: count,
      transaction: t,
    });

    if (wordsToReview.length === 0) {
      await t.rollback();
      return {
        status: "Ok",
        message:
          "Không có từ nào để kiểm tra. Vui lòng thêm từ mới vào danh sách học tập của bạn.",
        words: [],
      };
    }

    const newAttempt = await QuizAttempt.create(
      {
        user_id: userId,
        started_at: new Date(),
        total_questions: wordsToReview.length,
        score: 0,
        correct_count: 0,
      },
      { transaction: t }
    );
    console.log("newAttempt", newAttempt);
    const quizQuestions = wordsToReview.map((word) => {
      return {
        user_word_id: word.id,
        vn_meaning: word.vietnamese_meaning,
      };
    });

    await t.commit();

    return {
      status: "Ok",
      message: "Lấy danh sách từ để kiểm tra thành công",
      data: {
        attempt_id: newAttempt.id,
        questions: quizQuestions,
      },
    };
  } catch (e) {
    console.log(e);
    await t.rollback();
    return {
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    };
  }
};

const submitQuiz = async (userId, attempt_id, answers) => {
  const t = await sequelize.transaction();
  try {
    const attempt = await QuizAttempt.findOne({
      where: { id: attempt_id, user_id: userId },
      transaction: t,
    });
    if (!attempt) {
      attempt = await QuizAttempt.create(
        {
          user_id: userId,
          started_at: new Date(),
          total_questions: answers.length,
          score: 0,
          correct_count: 0,
        },
        { transaction: t }
      );
    }

    const wordIds = answers.map((ans) => ans.user_word_id);
    const userWords = await UserWord.findAll({
      where: { id: wordIds, user_id: userId },
      transaction: t,
    });

    const wordMap = {};
    userWords.forEach((word) => {
      wordMap[word.id] = word;
    });

    let correct_answers = 0;
    const quizItemsData = [];

    for (const answer of answers) {
      const word = wordMap[answer.user_word_id];
      if (word) {
        const userSubmit = (answer.user_answer || "").trim().toLowerCase();
        const correctEnglish = word.english_word.trim().toLowerCase();

        const isActuallyCorrect = userSubmit === correctEnglish;

        if (isActuallyCorrect) correct_answers += 1;

        quizItemsData.push({
          attempt_id: attempt.id,
          user_word_id: word.id,
          question_text: word.vietnamese_meaning,
          correct_answer: word.english_word,
          user_answer: answer.user_answer,
          is_correct: isActuallyCorrect,
        });

        if (isActuallyCorrect) {
          word.mastery_level += 1;
        } else {
          word.mastery_level = Math.max(0, word.mastery_level - 1);
        }

        word.last_reviewed_at = new Date();
        await word.save({ transaction: t });
      }
    }

    if (quizItemsData.length > 0) {
      await QuizItem.bulkCreate(quizItemsData, { transaction: t });
    }

    const totalQuestions = attempt.total_questions || answers.length;
    const score =
      totalQuestions > 0
        ? Math.round((correct_answers / totalQuestions) * 100)
        : 0;

    attempt.finished_at = new Date();
    attempt.correct_count = correct_answers;
    attempt.score = score;
    await attempt.save({ transaction: t });

    await t.commit();

    return {
      status: "Ok",
      message: "Nộp bài kiểm tra thành công",
      data: {
        attempt_id: attempt.id,
        correct_answers: correct_answers,
        total_questions: totalQuestions,
        score: score,
      },
    };
  } catch (e) {
    console.log(e);
    await t.rollback();
    return {
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    };
  }
};
module.exports = {
  startQuiz,
  submitQuiz,
};
