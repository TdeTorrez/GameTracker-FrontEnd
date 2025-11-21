import React from "react";

export default function ReviewList({ reviews = [] }) {
  if (!reviews.length) return <p>No hay reseñas.</p>;
  return (
    <div>
      {reviews.map(r => (
        <div key={r._id} className="review">
          <strong>{r.titulo || ""}</strong>
          <p>{r.contenido}</p>
          <small>{r.estrellas} ⭐ — {r.autor?.nombre || "Usuario"}</small>
        </div>
      ))}
    </div>
  );
}
