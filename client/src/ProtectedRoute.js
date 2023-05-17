import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context/FireBaseContext";

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) {
    return 
    // <div>Loading...</div>; // Render a loading spinner or something similar here
  }

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
