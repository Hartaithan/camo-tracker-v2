const { Schema, model } = require("mongoose");

const schema = new Schema({
  tokenId: { type: String },
  userId: { type: String },
});

module.exports = model("Token", schema);
