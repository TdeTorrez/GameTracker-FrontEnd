import React, { useState } from "react";
import { createReview } from "../api/api";

export default function ReviewForm({ gameId, token, onPosted }) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [estrellas, setEstrellas] = useState(5);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await createReview({ juego: gameId, titulo, contenido, estrellas }, token);
    if (res._id) {
      setTitulo("");
      setContenido("");
      setEstrellas(5);
      if (onPosted) onPosted();
    } else {
      alert(res.msg || "Error al publicar reseña");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Título (opcional)" value={titulo} onChange={e => setTitulo(e.target.value)} />
      <textarea placeholder="Escribe tu reseña..." value={contenido} onChange={e => setContenido(e.target.value)} />
      <label>
        Estrellas:
        <input type="number" min="0" max="5" value={estrellas} onChange={e => setEstrellas(Number(e.target.value))} />
      </label>
      <button type="submit">Publicar reseña</button>
    </form>
  );
}
