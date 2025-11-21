import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <div>
      <header>
        <h1><Link to="/">GameTracker</Link></h1>
        <nav>
          <Link to="/">Home</Link>{" | "}
          <Link to="/profile">Mi Biblioteca</Link>{" | "}
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/:id" element={<GamePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
