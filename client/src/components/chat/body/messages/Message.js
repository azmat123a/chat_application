import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import useChat from "../../../Hooks/ChatHook";
import { AuthContext } from "../../../../Context/FireBaseContext";

import "./Message.css";

const Message = ({ onMessageReceived }) => {
  const { loggedInUser, selectedUser } = useContext(AuthContext);
  const [disable, setDisable] = useState(true);
  let loginUserID = loggedInUser?._id;
  const { messages, sendMessage } = useChat(
    loginUserID,
    selectedUser?._id,
    onMessageReceived
  );
  const [inputMessage, setInputMessage] = useState("");
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    setDisable(e.target.value.trim() === "");
  };

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim() === "") return;
    sendMessage(inputMessage);
    setInputMessage("");
    setDisable(true);
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [inputMessage, sendMessage]);

  return (
    <div className="d-flex flex-column align-items-center">
      {selectedUser && (
        <>
          <MessageList
            messages={messages}
            loginUser={loginUserID}
            userName={selectedUser.firstName}
            messageContainerRef={messageContainerRef}
            selectedUserID={selectedUser?._id}
          />
          <MessageForm
            loginUser={loginUserID}
            selectedUser={selectedUser?._id}
            inputMessage={inputMessage}
            handleInputChange={handleInputChange}
            handleSendMessage={handleSendMessage}
            disable={disable}
          />
        </>
      )}
    </div>
  );
};

const MessageList = ({
  messages,
  loginUser,
  userName,
  messageContainerRef,
  selectedUserID,
}) => (
  
  <div className="message-container" ref={messageContainerRef}>
    {Array.isArray(messages) &&
      messages.map((message, index) => {
        const isConsecutiveMessage =
          index > 0 && messages[index - 1].from === message.from;

        return (
          <div key={message._id}>
            {message.from === loginUser && (
              <FromDiv message={message.message} time={message.timestamp} />
            )}
            {message.from === selectedUserID && (
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
);

const MessageForm = ({
  inputMessage,
  handleInputChange,
  handleSendMessage,
  disable,
}) => (
  <div className="input-container-main">
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
      <button
        className="send-btn"
        onClick={handleSendMessage}
        disabled={disable}
      >
        Send
      </button>
    </div>
  </div>
);

const FromDiv = ({ message, time }) => (
  <div>
    <div className="from-container">
      <p className="message">{message}</p>
    </div>
    <div className="time-from">
      {new Date(time).toLocaleString("en-US", { timeStyle: "short" })}
    </div>
  </div>
);
const ToDiv = ({ message, time, name }) => (
  <div>
    {name && <div className="user-name">{name}</div>}
    <div className="to-container">
      <p className="message">{message}</p>
    </div>
    <div className="time-to">
      {new Date(time).toLocaleString("en-US", { timeStyle: "short" })}
    </div>
  </div>
);
export default Message;
