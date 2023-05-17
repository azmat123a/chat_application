// useChat.js
import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const useChat = (userId, otherUserId, onMessageReceived) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    socketRef.current.on("newMessage", (newMessage) => {
      console.log("mesaage come")
      if (
        newMessage.from === userId ||
        newMessage.to === userId ||
        newMessage.from === otherUserId ||
        newMessage.to === otherUserId
      ) {
        setMessages((messages) => [...messages, newMessage]);
      }
      onMessageReceived(true);
    });

    socketRef.current.emit("join", userId);

    return () => {
      socketRef.current.disconnect();
    };
  }, [otherUserId]);

  const fetchMessages = async () => {
    setMessages([])
    if (otherUserId) {
      try {
        const response = await fetch(
          `${SOCKET_SERVER_URL}/api/chat/${userId}/${otherUserId}/messages`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [otherUserId]);

  const sendMessage = (message) => {
    const messageData = {
      from: userId,
      to: otherUserId,
      message,
    };
    socketRef.current.emit("send", messageData);
  };

  return { messages, sendMessage };
};

export default useChat;
