const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.API_KEY;

function checkApiKey(req, res, next) {
  // Kiểm tra API Key có tồn tại trong environment
  if (!API_KEY) {
    console.error("API_KEY is not defined in environment variables");
    return res.status(500).json({ message: "Server configuration error" });
  }

  // Lấy API Key từ header
  const clientKey = req.headers["x-api-key"];

  // Kiểm tra API Key có được gửi từ client
  if (!clientKey) {
    return res.status(401).json({
      message: "Unauthorized: API Key is missing",
      error: "Missing x-api-key header",
    });
  }

  // Kiểm tra API Key có khớp không
  if (clientKey !== API_KEY) {
    return res.status(401).json({
      message: "Unauthorized: Invalid API Key",
      error: "Invalid x-api-key header value",
    });
  }

  // API Key hợp lệ, tiếp tục
  return next();
}

module.exports = checkApiKey;
