import React, { useState } from "react";
import { createReview } from "../api/api";

function StarRating({ value = 0, onChange }) {
  const stars = [1,2,3,4,5];
  return (
    <div className="star-rating">
      {stars.map(s => (
        <button
          key={s}
          type="button"
          className={s <= value ? "star active" : "star"}
          onClick={() => onChange(s)}
        >★</button>
      ))}
    </div>
  );
}

export default function ReviewForm({ gameId, token, onPosted, game }) {
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
    <div>
      {game && (
        <div className="review-game-head">
          <img src={(game.portadaUrl && String(game.portadaUrl).trim()) ? game.portadaUrl : "/placeholder.svg"} alt={game.titulo} className="review-game-cover" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
          <div className="review-game-title">{game.titulo}</div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <StarRating value={estrellas} onChange={setEstrellas} />
        <input placeholder="Título (opcional)" value={titulo} onChange={e => setTitulo(e.target.value)} />
        <textarea placeholder="Escribe tu reseña..." value={contenido} onChange={e => setContenido(e.target.value)} />
        <button type="submit" className="btn btn-primary">Publicar reseña</button>
      </form>
    </div>
  );
}
