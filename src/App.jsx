import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import PublicProfile from "./pages/PublicProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Popup from "./components/Popup";

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [logoutOpen, setLogoutOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  useEffect(() => {
    const i = setInterval(() => setAuth(!!localStorage.getItem("token")), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <div>
      <header>
        <h1><Link to="/">GameTracker</Link></h1>
        <nav>
          <Link to="/">Home</Link>{" | "}
          <Link to="/profile">Mi Biblioteca</Link>{" | "}
          <Link to="/me">Perfil</Link>{" | "}
          {!auth && (<Link to="/login">Login</Link>)}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/:id" element={<GamePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/me" element={<UserProfile />} />
          <Route path="/user/:id" element={<PublicProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {/* Logout se movió al perfil */}
    </div>
  );
}
