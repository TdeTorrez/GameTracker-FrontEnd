import React from "react";
import GameCard from "./GameCard";

export default function Library({ games = [], personal = false }) {
  if (!games.length) return <p>No hay juegos aun.</p>;
  return (
    <div className="grid">
      {games.map(g => <GameCard key={g._id} game={g} personal={personal} />)}
    </div>
  );
}
