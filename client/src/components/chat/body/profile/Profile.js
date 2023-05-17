import React, { useContext  } from "react";
import { AuthContext } from "../../../../Context/FireBaseContext";
import "./Profile.css";
const Profile = () => {
  const { selectedUser } = useContext(AuthContext);
  return (
    <div className="profile-component">
      <div className="user-top-section">
        <img
          src={selectedUser?.profileImage}
          alt="Profile"
        />
        <p>{selectedUser?.firstName}</p>
      </div>
      <div className="user-bottom-section">
        <p className="heading">Username</p>
        <p>{selectedUser?.username}</p>
        <p className="heading">Bio</p>
        <p>{selectedUser?.bio}</p>
      </div>
    </div>
  );
};

export default Profile;
