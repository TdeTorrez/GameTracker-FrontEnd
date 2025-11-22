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
      <img src={cover} alt={game.titulo} className="card-cover" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
      <h4 className="card-title"><Link to={`/games/${game._id}`}>{game.titulo}</Link></h4>
      <p className="card-meta">{game.plataforma}</p>
      <p className="card-meta">⭐ {game.puntuacionPromedio?.toFixed(1) || "—"}</p>
      <p className="card-meta">Horas: {game.horasJugadas}</p>
      {personal && (
        <div className="actions-overlay">
          <button className="btn btn-primary" onClick={() => onEdit && onEdit(game)}>Editar</button>
          <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
