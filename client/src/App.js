import "./App.css";
import Login from "./components/login/Login";
import Profile from "./components/profile/profile";
import { Main } from "./components/chat/main/Main";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <div className="App">
      {/* <Login />
      <Profile />
      <Chat/> */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        {/* <Route path="/chat" element={<Main/>} /> */}
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
