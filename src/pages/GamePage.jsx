import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGame } from "../api/api";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import Popup from "../components/Popup";

export default function GamePage() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const token = localStorage.getItem("token");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchGame(id).then(data => setGameData(data));
    const t = setInterval(() => fetchGame(id).then(setGameData), 60000);
    return () => clearInterval(t);
  }, [id]);

  if (!gameData) return <p>Cargando...</p>;

  const { game, reviews } = gameData;

  return (
    <div>
      <div className="game-info-card">
        <img src={(game.portadaUrl && String(game.portadaUrl).trim()) ? game.portadaUrl : "/placeholder.svg"} alt={game.titulo} className="game-info-cover" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
        <h2 className="game-info-title">{game.titulo}</h2>
        <p className="game-info-desc">{game.descripcion}</p>
        <p>Plataforma: {game.plataforma}</p>
        <p>Horas jugadas: {game.horasJugadas}</p>
        <p>Promedio: {game.puntuacionPromedio?.toFixed(1) || "—"}</p>
      </div>

      <h3>Reseñas</h3>
      <ReviewList reviews={reviews} onDeleted={() => fetchGame(id).then(setGameData)} />
      {token ? (
        <div>
          <button className="btn btn-primary" onClick={() => setShowReviewForm(v => !v)}>
            {showReviewForm ? "Cerrar" : "Escribir reseña"}
          </button>
          <Popup open={showReviewForm} title="Escribir reseña" onClose={() => setShowReviewForm(false)}>
            <ReviewForm game={game} gameId={game._id} onPosted={() => { setShowReviewForm(false); fetchGame(id).then(setGameData); }} token={token} />
          </Popup>
        </div>
      ) : (
        <p>Inicia sesión para comentar.</p>
      )}
    </div>
  );
}
