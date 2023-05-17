// controllers/user.controller.js
const User = require("../../_model/users/users");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const generateToken = (user) => {
  return jwt.sign({ user }, secret, { expiresIn: "24h" });
};

exports.getUserByUid = async (req, res) => {
  console.log("getUserByUid"+secret)
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (!user) {
      res.status(200).json({ exists: false, message: "User not found" });
    } else {
      const token = generateToken(user);

      if (!token) {
        throw new Error("Failed to generate token");
      }
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
      });
      res.json({ exists: true, user });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error getting user", error });
  }
};

exports.postUser = async (req, res) => {
  const { uid, firstName, lastName, username, bio, profileImage, mobile } =
    req.body;
  try {
    const newUser = new User({
      uid,
      firstName,
      lastName,
      username,
      bio,
      profileImage,
      mobile,
    });
    await newUser.save();
    ////
    const token = generateToken(newUser);

    if (!token) {
      throw new Error("Failed to generate token");
    }
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
    });
    //
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error creating user", error });
  }
};

exports.searchUser = async (req, res) => {
  const token = req.cookies.token;
  // Verify and decode the JWT
  const decoded = jwt.verify(token, secret);
  const uid = decoded.user._id;
  const ObjectId = mongoose.Types.ObjectId;
  const { query } = req.query;
  // const { uid } = req.query; // assuming uid of the searching user is available in req.user
  try {
    const results = await User.find({
      _id: { $ne: new ObjectId(uid) }, // exclude the searching user
      $or: [
        { username: { $regex: query, $options: "i" } },
        { mobile: { $regex: query, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error searching users", error });
  }
};

exports.updateUserStatus = async (userId, status) => {
  try {
    if (!userId || !status) {
      throw new Error("Invalid parameters");
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { ...status },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

exports.getUserByJWT = async (req, res) => {
  try {
    // Get the JWT token from the cookie
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "No token in request" });
      return;
    }

    // Verify and decode the JWT
    const decoded = jwt.verify(token, secret);
    const uid = decoded.user.uid;

    const user = await User.findOne({ uid });

    if (!user) {
      res
        .status(200)
        .json({ exists: false, message: "Usersssssssss not found" });
    } else {
      // Note: there's no need to generate a new token and set it as a cookie here
      res.json({ exists: true, user });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error getting user", error });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
};
