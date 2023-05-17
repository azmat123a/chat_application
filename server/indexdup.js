const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./_routes/users/users");
const imageRoutes = require("./_routes/uploads/uploads");
const chatRoutes = require("./_routes/chat/chat.route.js");

const app = express();
app.use(cors());
app.use(express.json());

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
  cors: {
    
    
  },
});

io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    console.log(userId)
    console.log(`User ${userId} joined room:`, socket.id);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
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
