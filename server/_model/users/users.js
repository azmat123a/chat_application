const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  bio: { type: String },
  profileImage: { type: String },
  mobile: { type: String, required: true },
  online: { type: Boolean, default: true },
  lastSeen: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
