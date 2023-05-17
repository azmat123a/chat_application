import { ReactComponent as Logo } from "../../../assets/logo.svg";
import { ReactComponent as Settings } from "../../../assets/settings.svg";
import { ReactComponent as Dots } from "../../../assets/verticalthreedots.svg";
import { useContext } from "react";
import { AuthContext } from "../../../Context/FireBaseContext";
import { logoutUser } from "./../../../APIS/users/user._api";
import "./Header.css";
const Headers = () => {
  const { setIsAuthenticated, selectedUser, loggedInUser } =
    useContext(AuthContext);
  const handleLogout = async () => {
    logoutUser()
      .then((res) => {
        setIsAuthenticated(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="header container-fluid">
      <div className="row">
        <div className="col-2 my-auto left">
          <Logo />
        </div>
        <div className="col-8 my-auto">
          <span>{selectedUser && selectedUser.firstName}</span>
          {/* {getOtherUserStatus()} */}
        </div>
        <div className="col-2 d-flex justify-content-end align-items-center right">
          <Settings className="me-3 icon" />
          <div className="dropdown me-3">
            <Dots
              className="icon dropdown-toggle"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          <img src={loggedInUser?.profileImage} />
        </div>
      </div>
    </div>
  );
};

export default Headers;



