import React, { useState } from "react";
import { login } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import Popup from "../components/Popup";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await login({ correo, password });
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/profile");
    } else {
      alert(res.msg || "Error al iniciar sesión");
    }
  }

  return (
    <Popup open title="Iniciar sesión" onClose={() => navigate("/") }>
      <form onSubmit={handleSubmit}>
        <input placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </Popup>
  );
}
