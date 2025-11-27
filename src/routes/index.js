const authRouter = require("./authRouter");
const userWordsRouter = require("./userWordRouter");
const quizRouter = require("./quizRouter");
const attemptsRouter = require("./attemptsRouter");

const route = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user-words", userWordsRouter);
  app.use("/api/quiz", quizRouter);
  app.use("/api/attempts", attemptsRouter);
};

module.exports = route;
