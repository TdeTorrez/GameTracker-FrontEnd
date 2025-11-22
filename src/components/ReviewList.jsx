import React, { useEffect, useState } from "react";
import { deleteReview } from "../api/api";
import { updateReview } from "../api/api";
import Popup from "./Popup";
import ReviewForm from "./ReviewForm";
import { Link } from "react-router-dom";

export default function ReviewList({ reviews = [], onDeleted }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [editing, setEditing] = useState(null);
  const [list, setList] = useState(reviews);
  useEffect(() => { setList(reviews); }, [reviews]);
  const ratingStars = (n) => Array.from({ length: 5 }).map((_, i) => {
    const full = i + 1 <= Math.floor(n);
    return (
      <span key={i} className={`star ${full ? 'full' : 'empty'}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
        </svg>
      </span>
    );
  });
  if (!reviews.length) return <p>No hay reseñas.</p>;
  return (
    <div className="review-list">
      {list.map(r => {
        const authorId = r.autor?.id || r.autor?._id;
        const canDelete = user && authorId === user.id;
        const canEdit = canDelete;
        const recommended = (r.estrellas || 0) >= 3;
        const avatarUrl = localStorage.getItem(`avatar_${authorId}`) || "";
        return (
          <div key={r._id} className="review-card">
            <div className="review-layout">
              <div className="review-side">
                <Link to={`/user/${authorId}`} className="review-avatar" aria-label={`Ver perfil de ${r.autor?.nombre || 'Usuario'}`}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:8}} onError={(e) => { e.currentTarget.style.display='none'; }} />
                  ) : (
                    <div className="avatar-initials">{(r.autor?.nombre || "U").slice(0,2)}</div>
                  )}
                </Link>
                <div className="review-side-info">
                  <div className="review-author">{r.autor?.nombre || "Usuario"}</div>
                </div>
              </div>
              <div className="review-body">
                <div className="review-header">
                  <div className={recommended ? "badge recommend" : "badge not-recommend"}>
                    {recommended ? "Recomendado" : "No recomendado"}
                  </div>
                  <button
                    className={`fav-star ${r.favorita ? 'on' : ''}`}
                    title={r.favorita ? 'Quitar de favoritos' : 'Marcar como favorito'}
                    aria-label={r.favorita ? 'Quitar de favoritos' : 'Marcar como favorito'}
                    onClick={async () => {
                      if (!token || !canEdit) return;
                      try {
                        setList(prev => prev.map(x => x._id === r._id ? { ...x, favorita: !x.favorita } : x));
                        await updateReview(r._id, { favorita: !r.favorita }, token);
                        if (onDeleted) onDeleted();
                      } catch (e) { alert('No se pudo cambiar favorito'); }
                    }}
                  >★</button>
                </div>
                <div className="review-published">Publicada el {new Date(r.createdAt).toLocaleDateString()}</div>
                {r.titulo && <div className="review-title">{r.titulo}</div>}
                <div className="review-content">{r.contenido}</div>
                <div className="card-rating" style={{justifyContent:'flex-start'}}>
                  {ratingStars(r.estrellas || 0)}
                  <span className="rating-text" style={{marginLeft:6,fontWeight:700}}>{r.estrellas?.toFixed ? r.estrellas.toFixed(1) : r.estrellas}</span>
                </div>
              </div>
            </div>
            {(canDelete || canEdit) && (
              <div className="review-actions-bottom">
                {canEdit && (
                  <button className="icon-btn icon-edit" onClick={() => setEditing(r)} aria-label="Editar reseña">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
                      <path d="M20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.29a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                    </svg>
                  </button>
                )}
                {canDelete && (
                  <button className="icon-btn icon-trash" onClick={async () => {
                    if (!confirm("¿Eliminar esta reseña?")) return;
                    const res = await deleteReview(r._id, token);
                    if (res && (res.msg === "Eliminado" || res._id || res.ok)) {
                      if (onDeleted) onDeleted();
                    } else {
                      alert(res?.msg || "No se pudo eliminar la reseña");
                    }
                  }} aria-label="Eliminar reseña">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M9 7V5h6v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <Popup open={!!editing} title="Editar reseña" onClose={() => setEditing(null)}>
        {editing && (
          <ReviewForm initial={editing} token={token} onPosted={() => { setEditing(null); if (onDeleted) onDeleted(); }} />
        )}
      </Popup>
    </div>
  );
}
