const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.YOUR_PORT || process.env.PORT || 5000;

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/data", require("./routes/data.routes"));

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
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
