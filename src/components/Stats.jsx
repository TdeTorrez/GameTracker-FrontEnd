import React from "react";

export default function Stats({ games = [] }) {
  const totalHoras = games.reduce((s, g) => s + (g.horasJugadas || 0), 0);
  const completados = games.filter(g => g.completado).length;
  const promedio = games.length ? (games.reduce((s, g) => s + (g.puntuacionPromedio || 0), 0) / games.length).toFixed(1) : "—";

  return (
    <div>
      <p><span className="stats-label">Horas jugadas totales:</span><span className="stats-value"> {totalHoras}</span></p>
      <p><span className="stats-label">Juegos completados:</span><span className="stats-value"> {completados}</span></p>
      <p><span className="stats-label">Puntuación promedio:</span><span className="stats-value"> {promedio}</span></p>
    </div>
  );
}
