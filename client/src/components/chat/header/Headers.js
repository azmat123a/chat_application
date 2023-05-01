import { ReactComponent as Logo } from "../../../assets/logo.svg";
import { ReactComponent as Settings } from "../../../assets/settings.svg";
import { ReactComponent as Dots } from "../../../assets/verticalthreedots.svg";
import ProfileImg from "../../../assets/Photo.png";
import { useContext } from "react";
import { AuthContext } from "../../../Context/FireBaseContext";
import "./Header.css";
const Headers = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div className="header container-fluid">
      <div className="row">
        <div className="col-2 my-auto left">
          <Logo />
        </div>
        <div className="col-8 my-auto">
          <span>Caesar</span> last seen 5 min ago
        </div>
        <div className="col-2 d-flex justify-content-end align-items-center right">
          <Settings className="me-3 icon" />
          <Dots className="me-3 icon" />
          <img src={user.profileImage} />
        </div>
      </div>
    </div>
  );
};

export default Headers;
