import "./App.css";
import { useContext } from "react";
import Login from "./components/login/Login";
import Profile from "./components/profile/profile";
import { Main } from "./components/chat/main/Main";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "./Context/FireBaseContext";
import { Navigate } from "react-router-dom";

function App() {
  const LoginRoute = ({ component: Component }) => {
    const { isAuthenticated,loading } = useContext(AuthContext);
    if (loading) {
      return 
    }
    return isAuthenticated ? <Navigate to="/chat" /> : <Component />;
  };
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginRoute component={Login} />} />
        <Route
          path="/profile"
          element={<ProtectedRoute component={Profile} />}
        />
        <Route path="/chat" element={<ProtectedRoute component={Main} />} />
      </Routes>
    </div>
  );
}

export default App;
