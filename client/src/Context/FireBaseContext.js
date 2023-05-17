// FireBaseContext.js
import { createContext, useState, useEffect } from "react";
import { getUserByJWT } from "../APIS/users/user._api";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [otherUserStatus, setOtherUserStatus] = useState({
    online: false,
    lastSeen: null,
  });

  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByJWT(); // Modify this function to extract user from JWT
        if (response && response.exists) {
          console.log("context");
          console.log(response);
          setLoggedInUser(response.user);
          setIsAuthenticated(true);
        }
        setLoading(false); // Stop loading after fetching the user data
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        otherUserStatus,
        setOtherUserStatus,

        //new values
        loggedInUser,
        setLoggedInUser,
        selectedUser,
        setSelectedUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
