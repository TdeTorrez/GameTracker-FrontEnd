import React, { useEffect, useMemo, useState } from "react";
import { fetchGames } from "../api/api";
import Library from "../components/Library";

export default function Home({ search = "", platform = "" }) {
  const [games, setGames] = useState([]);
  const [q, setQ] = useState(search);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  useEffect(() => {
    const term = q || search;
    fetchGames(term).then(setGames);
    const t = setInterval(() => fetchGames(term).then(setGames), 60000);
    return () => clearInterval(t);
  }, [q, search]);
  const visible = useMemo(() => {
    const items = [...games];
    if (sort === "rating") items.sort((a,b) => (b.puntuacionPromedio||0) - (a.puntuacionPromedio||0));
    else if (sort === "hours") items.sort((a,b) => (b.horasJugadas||0) - (a.horasJugadas||0));
    const start = (page-1)*pageSize;
    return items.slice(start, start+pageSize);
  }, [games, sort, page]);
  const totalPages = Math.max(1, Math.ceil(games.length / pageSize));
  return (
    <div>
      <h2>Catálogo de juegos</h2>
      <div className="toolbar">
        <input placeholder="Buscar..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="recent">Más recientes</option>
          <option value="rating">Mejor puntuados</option>
          <option value="hours">Más horas</option>
        </select>
      </div>
      <Library games={visible.filter(g => platform ? (g.plataforma || "").toLowerCase().includes(platform.toLowerCase()) : true)} />
      <div className="toolbar">
        <button className="btn" disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))}>Página anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button className="btn" disabled={page>=totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Siguiente página</button>
      </div>
    </div>
  );
}
