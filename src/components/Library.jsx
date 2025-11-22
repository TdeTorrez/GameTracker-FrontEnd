import React from "react";
import GameCard from "./GameCard";

export default function Library({ games = [], personal = false, onDelete, onEdit, token, emptyMessage }) {
  if (!games.length) return <p>{emptyMessage || "No hay juegos aun."}</p>;
  return (
    <div className="grid">
      {games.map(g => (
        <GameCard key={g._id} game={g} personal={personal} onDelete={onDelete} onEdit={onEdit} token={token} />
      ))}
    </div>
  );
}
