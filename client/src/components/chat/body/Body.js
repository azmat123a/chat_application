import React, { useState } from "react";
import "./Body.css";
import { Search } from "./search/Search";
import Profile from "./profile/Profile";
import Message from "./messages/Message";
import { useContext } from "react";

import { AuthContext } from "../../../Context/FireBaseContext";

const Body = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("")
  const [messageCount, setMessageCount] = useState(0);
  const [loginUser, setLoginUser] = useState("");

  const {loggedInUser} = useContext(AuthContext);
  useState(() => {
    console.log(loggedInUser)
    setLoginUser(loggedInUser?._id);
  }, [loggedInUser]);
 

  const handleMessageReceived = () => {
    setMessageCount((count) => count + 1);
  };

  return (
    <div className="body container-fluid">
      <div className="row">
        <div className="col-2 left">
          <Search  messageCount={messageCount} loginUser={loginUser}/>
        </div>
        <div className="col-8 p-5  justify-content-center align-items-center text-center">
          <Message
            selectedUser={selectedUser}
            onMessageReceived={handleMessageReceived}
            loginUser={loginUser}
            userName={selectedUserName}
          />
        </div>
        <div className="col-2 ">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Body;
