import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context/FireBaseContext";

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
