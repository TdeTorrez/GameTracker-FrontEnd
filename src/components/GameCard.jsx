import React from "react";
import { Link } from "react-router-dom";

export default function GameCard({ game, personal = false, onDelete, onEdit, token }) {
  function handleDelete() {
    if (!onDelete) return;
    onDelete(game._id, token);
  }
  const cover = (game.portadaUrl && String(game.portadaUrl).trim()) ? game.portadaUrl : "/placeholder.svg";

  return (
    <div className="game-card">
      <Link to={`/games/${game._id}`} aria-label={`Ver reseñas de ${game.titulo}`}>
        <img src={cover} alt={game.titulo} className="card-cover" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
      </Link>
      <h4 className="card-title">{game.titulo}</h4>
      <p className="card-meta platform-text">{game.plataforma}</p>
      <div className="card-rating">
        {Array.from({ length: 5 }).map((_, i) => {
          const rating = Number(game.puntuacionPromedio || 0);
          const full = i + 1 <= Math.floor(rating);
          const half = !full && i + 1 === Math.ceil(rating) && rating % 1 >= 0.5;
          return (
            <span key={i} className={`star ${full ? 'full' : half ? 'half' : 'empty'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
              </svg>
            </span>
          );
        })}
        <span className="rating-text">{(game.puntuacionPromedio ?? 0).toFixed(1)}</span>
      </div>
      <p className="card-meta">Horas: {game.horasJugadas}</p>
      {personal && (
        <div className="card-icons">
          <button className="icon-btn icon-edit" onClick={() => onEdit && onEdit(game)} aria-label="Editar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
              <path d="M20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.29a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
            </svg>
          </button>
          <button className="icon-btn icon-trash" onClick={handleDelete} aria-label="Eliminar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 7V5h6v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
