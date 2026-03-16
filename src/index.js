const express = require("express");
const dotenv = require("dotenv");
const route = require("./routes/index");
const { connectDB } = require("./config/db");
const checkApiKey = require("./middleware/checkApiKey");
const morgan = require("morgan");

dotenv.config();
const app = express();

// Ensure models and their associations are initialized
// require("./models");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("combined"));

// Áp dụng API Key check cho tất cả routes API
app.use("/api", checkApiKey);

route(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
