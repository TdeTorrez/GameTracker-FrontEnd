import React, { useState } from "react";
import { register } from "../api/api";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await register({ nombre, correo, password });
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/profile");
    } else {
      alert(res.msg || "Error al registrarse");
    }
  }

  return (
    <Popup open title="Registro" onClose={() => navigate("/") }>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="btn btn-primary">Registrarme</button>
      </form>
    </Popup>
  );
}
