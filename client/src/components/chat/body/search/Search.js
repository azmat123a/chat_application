import React, { useState, useEffect } from "react";
import "./Search.css";
import { GetChattedUsers } from "../../../../APIS/chat/chat._api";
import { searchUser } from "../../../../APIS/users/user._api";
import { useContext } from "react";
import { AuthContext } from "../../../../Context/FireBaseContext";

export const Search = ({ messageCount, loginUser }) => {
  const [chattedUsers, setChattedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [noUserFound, setNoUserFound] = useState(false);
  const { setSelectedUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchChattedUsers = async () => {
      const users = await GetChattedUsers(loginUser);
      setChattedUsers(users);
      setFilteredUsers(users);
    };
    fetchChattedUsers();
  }, [messageCount, loginUser]);

  const handleSearch = async () => {
    setSearchActive(true);
    setNoUserFound(false);

    if (searchTerm.trim() !== "") {
      setLoading(true);
      const localFilteredUser = chattedUsers.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      try {
        const apiFilteredUser = await searchUser(searchTerm, loginUser);
        const newUsers = apiFilteredUser.map((user) => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`,
        }));

        // Filter out any users from the API results that are also in the local filtered users
        const uniqueApiUsers = newUsers.filter(
          (apiUser) =>
            !localFilteredUser.some(
              (localUser) => localUser._id === apiUser._id
            )
        );

        // Combine local and API search results
        const combinedUsers = [...localFilteredUser, ...uniqueApiUsers];
        setLoading(false);

        if (combinedUsers.length > 0) {
          setFilteredUsers(combinedUsers);
        } else {
          setFilteredUsers([]);
          setNoUserFound(true);
        }
      } catch (error) {
        console.error("Error searching for users:", error);
        setLoading(false);
      }
    } else {
      setSearchActive(false);
      setFilteredUsers(chattedUsers);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="search-component">
      <input
        placeholder="Search user"
        className="user-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onBlur={handleSearch}
      />
      {loading && <div>Loading...</div>}
      {!loading && searchActive && noUserFound && <div>No user found</div>}
      {!loading &&
        searchActive &&
        filteredUsers.length > 0 &&
        filteredUsers.map((user) => (
          <div
            className="user-inbox"
            key={user._id}
            onClick={() => handleUserClick(user)}
          >
            <img src={user.profileImage} alt="Profile" />
            <div className="user">
              <div className="d-flex">
                <p id="name">{user.fullName}</p>
                <p id="time">
                  {user?.lastMessageTimestamp
                    ? new Date(user?.lastMessageTimestamp).toLocaleString(
                        "en-US",
                        { timeStyle: "short" }
                      )
                    : ".................."}
                </p>
              </div>
              {user.lastMessage && (
                <p id="last-message">
                  {user.lastMessage && user.lastMessage.length > 10
                    ? `${user.lastMessage.substring(0, 10)}...`
                    : user.lastMessage}
                </p>
              )}
            </div>
          </div>
        ))}
      {!searchActive &&
        filteredUsers.map((user) => (
          <div
            className="user-inbox"
            key={user._id}
            onClick={() => handleUserClick(user)}
          >
            <img src={user.profileImage} alt="Profile" />
            <div className="user">
              <div className="d-flex">
                <p id="name">{user.fullName}</p>
                <p id="time">
                  {" "}
                  {user?.lastMessageTimestamp &&
                    new Date(user?.lastMessageTimestamp).toLocaleString(
                      "en-US",
                      { timeStyle: "short" }
                    )}
                </p>
              </div>
              {user.lastMessage && (
                <p id="last-message">
                  {user.lastMessage && user.lastMessage.length > 10
                    ? `${user.lastMessage.substring(0, 10)}...`
                    : user.lastMessage}
                </p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};
