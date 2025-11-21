import React from "react";

export default function Stats({ games = [] }) {
  const totalHoras = games.reduce((s, g) => s + (g.horasJugadas || 0), 0);
  const completados = games.filter(g => g.completado).length;
  const promedio = games.length ? (games.reduce((s, g) => s + (g.puntuacionPromedio || 0), 0) / games.length).toFixed(1) : "—";

  return (
    <div>
      <p>Horas jugadas totales: {totalHoras}</p>
      <p>Juegos completados: {completados}</p>
      <p>Puntuación promedio (mi biblioteca): {promedio}</p>
    </div>
  );
}
