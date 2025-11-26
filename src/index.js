const express = require("express");
const dotenv = require("dotenv");
const route = require("./routes/index");
const { connectDB } = require("./config/db");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
route(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
