import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGame } from "../api/api";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";

export default function GamePage() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGame(id).then(data => setGameData(data));
  }, [id]);

  if (!gameData) return <p>Cargando...</p>;

  const { game, reviews } = gameData;

  return (
    <div>
      <h2>{game.titulo}</h2>
      <img src={game.portadaUrl || "/placeholder.png"} alt={game.titulo} style={{ width: 200 }} />
      <p>{game.descripcion}</p>
      <p>Plataforma: {game.plataforma}</p>
      <p>Horas jugadas: {game.horasJugadas}</p>
      <p>Promedio: {game.puntuacionPromedio?.toFixed(1) || "—"}</p>

      <h3>Reseñas</h3>
      <ReviewList reviews={reviews} />
      {token ? <ReviewForm gameId={game._id} onPosted={() => fetchGame(id).then(setGameData)} token={token} /> : <p>Inicia sesión para comentar.</p>}
    </div>
  );
}
