const authRouter = require("./authRouter");
const userWordsRouter = require("./userWordRouter");

const route = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user-words", userWordsRouter);
};

module.exports = route;
