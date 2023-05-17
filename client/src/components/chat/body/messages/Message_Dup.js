import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./Message.css";
import { useContext } from "react";
import { AuthContext } from "../../../../Context/FireBaseContext";

const SOCKET_SERVER_URL = "http://localhost:5000";

const Message = ({ selectedUser, onMessageReceived, loginUser, userName }) => {
  const [userId, setUserId] = useState(loginUser);
  const [otherUserId, setOtherUserId] = useState(selectedUser);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const socketRef = useRef();
  const messageContainerRef = useRef(null);

  const { setOtherUserStatus } = useContext(AuthContext);

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    socketRef.current.on("userStatusUpdate", (statusUpdate) => {
      // console.log(statusUpdate)
      setOtherUserStatus(statusUpdate);
    });
  }, [userId, otherUserId]);

  useEffect(() => {
    setOtherUserId(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      // console.log("Fetching messages");
      try {
        const response = await fetch(
          `${SOCKET_SERVER_URL}/api/chat/${userId}/${otherUserId}/messages`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [otherUserId]);

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    socketRef.current.on("newMessage", (newMessage) => {
      if (
        newMessage.from === userId ||
        newMessage.to === userId ||
        newMessage.from === otherUserId ||
        newMessage.to === otherUserId
      ) {
        setMessages((messages) => [...messages, newMessage]);
        onMessageReceived(true);
      }
    });

    socketRef.current.emit("join", userId);

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, otherUserId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    const messageData = {
      from: userId,
      to: otherUserId,
      message: inputMessage,
    };
    socketRef.current.emit("send", messageData);
    setInputMessage("");
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {otherUserId && (
        <>
          <div className="message-container" ref={messageContainerRef}>
            {messages.map((message, index) => {
              const isConsecutiveMessage =
                index > 0 && messages[index - 1].from === message.from;

              return (
                <div key={message._id}>
                  {message.from === userId ? (
                    <FromDiv
                      message={message.message}
                      time={message.timestamp}
                    />
                  ) : (
                    <ToDiv
                      message={message.message}
                      time={message.timestamp}
                      name={!isConsecutiveMessage ? userName : undefined}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="input-container-main">
            <div className="input-container d-flex flex-column">
              <input
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.targetvalue);
                }}
                placeholder="Type your User ID..."
                className=""
              />
              <input
                type="text"
                value={otherUserId}
                onChange={(e) => {
                  setOtherUserId(e.target.value);
                }}
                placeholder="Type other User ID..."
                className=""
              />
            </div>
            <div className="typing-container">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className=""
              />
            </div>
            <div className="btns-container">
              <button className="send-btn" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const FromDiv = ({ message, time }) => {
  return (
    <div>
      <div className="from-container">
        <p className="message">{message}</p>
      </div>
      <div className="time-from">
        {new Date(time).toLocaleString("en-US", { timeStyle: "short" })}
      </div>
    </div>
  );
};

const ToDiv = ({ message, time, name }) => {
  return (
    <div>
      <div className="user-name">{name}</div>
      <div className="to-container">
        <p className="message">{message}</p>
      </div>
      <div className="time-to">
        {new Date(time).toLocaleString("en-US", { timeStyle: "short" })}
      </div>
    </div>
  );
};

export default Message;
