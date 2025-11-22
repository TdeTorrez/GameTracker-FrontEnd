import React from "react";
import { deleteReview } from "../api/api";

export default function ReviewList({ reviews = [], onDeleted }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!reviews.length) return <p>No hay reseñas.</p>;
  return (
    <div className="review-list">
      {reviews.map(r => {
        const authorId = r.autor?.id || r.autor?._id;
        const canDelete = user && authorId === user.id;
        const recommended = (r.estrellas || 0) >= 3;
        return (
          <div key={r._id} className="review-card">
            <div className="review-top">
              <div className={recommended ? "badge recommend" : "badge not-recommend"}>
                {recommended ? "👍 Recomendado" : "👎 No recomendado"}
              </div>
              <div className="review-author">{r.autor?.nombre || "Usuario"}</div>
            </div>
            {r.titulo && <div className="review-title">{r.titulo}</div>}
            <div className="review-content">{r.contenido}</div>
            <div className="review-meta">{r.estrellas} ⭐</div>
            {canDelete && (
              <div className="review-actions">
                <button className="btn btn-danger" onClick={async () => {
                  const res = await deleteReview(r._id, token);
                  if (res && (res.msg === "Eliminado" || res._id || res.ok)) {
                    if (onDeleted) onDeleted();
                  } else {
                    alert(res?.msg || "No se pudo eliminar la reseña");
                  }
                }}>Eliminar reseña</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
