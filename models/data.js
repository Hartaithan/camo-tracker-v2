const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  main: [{ type: Object }],
});

module.exports = model("Data", schema, "data");
