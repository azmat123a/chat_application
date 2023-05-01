import React from "react";
import "./Body.css";
import { Search } from "./search/Search";
import Profile from "./profile/Profile";
import Message from "./messages/Message";
const Body = () => {
  return (
    <div className="body container-fluid">
      <div className="row">
        <div className="col-2 left">
          <Search />
        </div>
        <div className="col-8 my-auto justify-content-center align-items-center text-center">
          <Message />
        </div>
        <div className="col-2 ">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Body;
