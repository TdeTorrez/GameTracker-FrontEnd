import React, { useState } from "react";
import { createGame, updateGame } from "../api/api";

export default function GameForm({ initial = {}, token, onSaved }) {
  const [titulo, setTitulo] = useState(initial.titulo || "");
  const [plataforma, setPlataforma] = useState(initial.plataforma || "");
  const [portadaUrl, setPortadaUrl] = useState(initial.portadaUrl || "");
  const [descripcion, setDescripcion] = useState(initial.descripcion || "");
  const [horasJugadas, setHorasJugadas] = useState(initial.horasJugadas || 0);
  const [completado, setCompletado] = useState(initial.completado || false);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { titulo, plataforma, portadaUrl, descripcion, horasJugadas, completado };
    if (initial._id) {
      await updateGame(initial._id, data, token);
    } else {
      await createGame(data, token);
    }
    if (onSaved) onSaved();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
      <div className="form-select-wrapper">
        <select className="form-select" value={plataforma} onChange={e => setPlataforma(e.target.value)}>
          <option value="">Plataforma</option>
          <option value="Mobile">Mobile</option>
          <option value="PC">PC</option>
          <option value="Consola">Consola</option>
          <option value="Otros">Otros</option>
        </select>
      </div>
      <input placeholder="URL portada" value={portadaUrl} onChange={e => setPortadaUrl(e.target.value)} />
      <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
      <input type="number" placeholder="Horas jugadas" value={horasJugadas} onChange={e => setHorasJugadas(Number(e.target.value))} />
      <div className="toggle">
        <input id="completedToggle" type="checkbox" checked={completado} onChange={e => setCompletado(e.target.checked)} />
        <label htmlFor="completedToggle">Completado</label>
      </div>
      <button type="submit" className="btn btn-primary">Guardar</button>
    </form>
  );
}
