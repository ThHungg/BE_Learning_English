const jwt = require("jsonwebtoken");

const gennerateToken = (payload) => {
  try {
    const token = jwt.sign({ ...payload }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (e) {
    return null;
  }
};

module.exports = { gennerateToken };
