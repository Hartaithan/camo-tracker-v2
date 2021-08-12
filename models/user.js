const { Schema, model } = require("mongoose");

const schema = new Schema({
	email: { type: String, required: true, unique: true },
	nick: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	state: [{ type: Object }],
});

module.exports = model("User", schema);
