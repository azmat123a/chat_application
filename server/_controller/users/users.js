// controllers/user.controller.js
const User = require("../../_model/users/users");

exports.getUserByUid = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (!user) {
      res.status(200).json({ exists: false, message: "User not found" });
    } else {
      res.json({ exists: true, user });
    }
  } catch (error) {
    res.status(400).json({ message: "Error getting user", error });
  }
};


exports.postUser = async (req, res) => {
  const { uid, firstName, lastName, username, bio, profileImage } = req.body;
  try {
    const newUser = new User({
      uid,
      firstName,
      lastName,
      username,
      bio,
      profileImage,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};
