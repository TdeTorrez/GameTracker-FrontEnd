import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Popup from "./components/Popup";

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [logoutOpen, setLogoutOpen] = useState(false);
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
          {auth ? (
            <button className="btn btn-danger" onClick={() => setLogoutOpen(true)}>Cerrar sesión</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
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
      <Popup open={logoutOpen} title="Confirmar cierre de sesión" onClose={() => setLogoutOpen(false)}>
        <p>¿Seguro que quieres cerrar la sesión?</p>
        <div className="toolbar">
          <button className="btn btn-primary" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); setLogoutOpen(false); setAuth(false); }}>Cerrar sesión</button>
          <button className="btn" onClick={() => setLogoutOpen(false)}>Cancelar</button>
        </div>
      </Popup>
    </div>
  );
}
