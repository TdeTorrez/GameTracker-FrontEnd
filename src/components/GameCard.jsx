import React from "react";
import { Link } from "react-router-dom";

export default function GameCard({ game }) {
  return (
    <div className="game-card">
      <img src={game.portadaUrl || "/placeholder.png"} alt={game.titulo} style={{ width: 150 }} />
      <h4><Link to={`/games/${game._id}`}>{game.titulo}</Link></h4>
      <p>{game.plataforma}</p>
      <p>⭐ {game.puntuacionPromedio?.toFixed(1) || "—"}</p>
      <p>Horas: {game.horasJugadas}</p>
    </div>
  );
}
