const Chat = require("../../_model/chat/chat.model.js");
const User = require("../../_model/users/users.js");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
// Get messages between two users
exports.getMessagesBetweenUsers = async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const chatHistory = await Chat.find({
      $or: [
        { from: userId, to: otherUserId },
        { from: otherUserId, to: userId },
      ],
    }).sort({ timestamp: "asc" });

    // Set the 'from' property to 'fromUser' for the messages sent by the logged-in user
    const messages = chatHistory.map((message) => {
      if (message.from === userId) {
        return { ...message._doc, from: "fromUser" };
      } else {
        return message;
      }
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error fetching chat history", error });
  }
};

const mongoose = require("mongoose");

exports.getChattedUsers = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    const uid = decoded.user._id;

    const userId = new mongoose.Types.ObjectId(uid);
    const chattedUsers = await Chat.aggregate([
      { $match: { $or: [{ from: userId }, { to: userId }] } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$from", userId] },
              then: "$to",
              else: "$from",
            },
          },
          lastMessage: { $last: "$message" },
          lastMessageTimestamp: { $last: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          fullName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          profileImage: "$user.profileImage",
          lastMessage: 1,
          lastMessageTimestamp: 1,
          firstName: "$user.firstName",
          bio: "$user.bio",
          mobile: "$user.mobile",
          username: "$user.username",
        },
      },
      {
        $sort: { lastMessageTimestamp: -1 },
      },
    ]);

    res.json(chattedUsers);
  } catch (error) {
    console.log("Err or getting chatted users:", error);
    res.status(400).json({ message: "Error getting chatted users", error });
  }
};
