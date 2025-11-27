const { QuizAttempt, QuizItem } = require("../models");

const getAttemptDetails = async (userId, attemptId) => {
  try {
    const attempt = await QuizAttempt.findOne({
      where: { id: attemptId, user_id: userId },
      include: [
        {
          model: QuizItem,
          as: "items",
        },
      ],
    });

    if (!attempt) {
      return {
        status: "Err",
        message: "Attempt not found",
      };
    }

    return {
      status: "Ok",
      data: attempt,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    };
  }
};

const getAllTempts = async (userId) => {
  try {
    const attempt = await QuizAttempt.findAll({
      where: { user_id: userId },
      //   include: [
      //     {
      //       model: QuizItem,
      //       as: "items",
      //     },
      //   ],
    });

    if (!attempt) {
      return {
        status: "Err",
        message: "Attempt not found",
      };
    }

    return {
      status: "Ok",
      data: attempt,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    };
  }
};

module.exports = {
  getAttemptDetails,
  getAllTempts,
};
