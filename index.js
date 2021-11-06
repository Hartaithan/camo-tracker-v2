const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.YOUR_PORT || process.env.PORT || 5000;

app.use(express.json({ extended: true }));
app.use(cors({ origin: "*" }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/data", require("./routes/data.routes"));
app.use("/api/refresh", require("./routes/refresh.routes"));

if (process.env.NODE_ENV === "production") {
  app.use("/coldwar", express.static("coldwar/build"));
  app.use("/vanguard", express.static("vanguard/build"));
  app.get("/coldwar/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "coldwar", "build", "index.html"));
  });
  app.get("/vanguard/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "vanguard", "build", "index.html"));
  });
}

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () => console.info(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("Server error", error.message);
    process.exit(1);
  }
}

start();
