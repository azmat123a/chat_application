const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config({ path: './.env' })
const userRoutes = require("./_routes/users/users");
const imageRoutes = require("./_routes/uploads/uploads");
const chatRoutes = require("./_routes/chat/chat.route.js");
const cookieParser = require('cookie-parser');


const app = express();

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  exposedHeaders:["Authorization"]
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());

const uri =
  "mongodb+srv://chat_application_user:123456.a@chatapplication.wfq1c87.mongodb.net/chat_application?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {},
});

io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  // index.js
  // index.js
  socket.on("join", async (userId) => {
    console.log(`User ${userId} joined room:`, socket.id);
    socket.userId = userId;
    socket.join(userId);

    // try {
    //   await userController.updateUserStatus(userId, {
    //     online: true,
    //   });

    //   io.emit("userStatusUpdate", { userId, online: true });
    // } catch (error) {
    //   console.log("Error updating user status on join:", error);
    // }
  });

  // index.js
  // index.js
  socket.on("leave", async (userId) => {
    console.log(`User ${userId} left room:`, socket.id);
    socket.leave(userId);

    // try {
    //   await userController.updateUserStatus(userId, {
    //     online: false,
    //     lastSeen: new Date(),
    //   });

    //   io.emit("userStatusUpdate", {
    //     userId,
    //     online: false,
    //     lastSeen: new Date(),
    //   });
    // } catch (error) {
    //   console.log("Error updating user status on leave:", error);
    // }
  });

  // index.js
  socket.on("disconnect", async () => {
    if (socket?.userId) {
      console.log("hello" + socket.userId);

      // try {
      //   await userController.updateUserStatus(socket.userId, {
      //     online: false,
      //     lastSeen: new Date(),
      //   });
      //   // Emit the updated user status to other clients
      //   socket.broadcast.emit("userStatusUpdate", {
      //     userId: socket.userId,
      //     online: false,
      //     lastSeen: new Date(),
      //   });
      // } catch (error) {
      //   console.error("Error updating user status on disconnect:", error);
      // }
    }
  });

  socket.on("send", async (messageData) => {
    const Chat = require("./_model/chat/chat.model.js");

    try {
      const newChat = new Chat(messageData);
      await newChat.save();

      io.to(messageData.from).emit("newMessage", newChat);
      io.to(messageData.to).emit("newMessage", newChat);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
