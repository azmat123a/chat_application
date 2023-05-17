const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
