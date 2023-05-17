// chat.route.js
const express = require("express");
const router = express.Router();

const chatController = require("../../_controller/chat/chat.controller.js");

// Get messages between two users
router.get(
  "/:userId/:otherUserId/messages",
  chatController.getMessagesBetweenUsers
);

router.get("/chatted-users/:userId", chatController.getChattedUsers);

module.exports = router;
