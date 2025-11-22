import React, { useEffect, useState } from "react";
import { fetchMyGames, deleteGame } from "../api/api";
import Library from "../components/Library";
import GameForm from "../components/GameForm";
import Popup from "../components/Popup";
import Stats from "../components/Stats";


export default function Profile({ globalSearch = "", globalPlatform = "", globalSort = "recent" }) {
  const [games, setGames] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editGame, setEditGame] = useState(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("recent");
  const [platform, setPlatform] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [view, setView] = useState("games");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetchMyGames(token).then(setGames);
    const t = setInterval(() => fetchMyGames(token).then(setGames), 60000);
    return () => clearInterval(t);
  }, [token]);

  if (!token) return <p>Debes iniciar sesión para ver tu biblioteca.</p>;

  return (
    <div>
      <h2>Mi Biblioteca</h2>
      <div className="toolbar controls">
        <button className="btn btn-secondary" onClick={() => setView(view === "games" ? "collections" : "games")}>{view === "games" ? "Mostrar colecciones" : "Mostrar juegos"}</button>
        {view === "games" && (
          <>
            <div className="input-with-icon"><input className="control-input" placeholder="Buscar..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} /></div>
            <select className="control-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="recent">Más recientes</option>
              <option value="rating">Mejor puntuados</option>
              <option value="hours">Más horas</option>
            </select>
            <select className="control-select" value={platform} onChange={e => setPlatform(e.target.value)}>
              <option value="">Todas las plataformas</option>
              {Array.from(new Set(games.map(g => (g.plataforma || "").trim()).filter(Boolean))).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </>
        )}
        {view === "games" && (
          <>
            <button className="btn" onClick={() => setSelectMode(s => !s)}>{selectMode ? "Cancelar selección" : "Seleccionar múltiples"}</button>
            {selectMode && (
              <>
                <button className="btn btn-danger" onClick={async () => {
                  for (const id of selected) { await deleteGame(id, token); }
                  setSelected([]);
                  fetchMyGames(token).then(setGames);
                }}>Eliminar seleccionados</button>
                <select id="collectionPick" className="select">
                  {JSON.parse(localStorage.getItem(`collections_${user?.id}`) || "[]").map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button className="btn" onClick={() => {
                  const raw = localStorage.getItem(`collections_${user?.id}`) || "[]";
                  const cols = JSON.parse(raw);
                  const el = document.getElementById("collectionPick");
                  const cid = el?.value;
                  if (!cid) return;
                  const updated = cols.map(c => c.id === cid ? { ...c, gameIds: Array.from(new Set([...(c.gameIds||[]), ...selected])) } : c);
                  localStorage.setItem(`collections_${user?.id}`, JSON.stringify(updated));
                }}>Añadir a colección</button>
              </>
            )}
          </>
        )}
      </div>
      <Popup open={showForm || !!editGame} title={editGame ? "Editar juego" : "Nuevo juego"} onClose={() => { setShowForm(false); setEditGame(null); }}>
        <GameForm initial={editGame || {}} token={token} onSaved={() => { setShowForm(false); setEditGame(null); fetchMyGames(token).then(setGames); }} />
      </Popup>
      <Stats games={games} />
      {view === "games" ? (
        <Library
          games={[...games]
            .filter(g => g.titulo.toLowerCase().includes(q.toLowerCase()))
            .filter(g => platform ? (g.plataforma || "").toLowerCase().includes(platform.toLowerCase()) : true)
            .sort((a,b) => (sort === "rating") ? (b.puntuacionPromedio||0)-(a.puntuacionPromedio||0) : (sort === "hours") ? (b.horasJugadas||0)-(a.horasJugadas||0) : 0)
            .slice((page-1)*pageSize, (page-1)*pageSize + pageSize)
          }
          personal
          token={token}
          selectMode={selectMode}
          selectedIds={selected}
          onSelectToggle={(id, val) => setSelected(prev => val ? [...prev, id] : prev.filter(x => x !== id))}
          onDelete={async (id) => {
            await deleteGame(id, token);
            fetchMyGames(token).then(setGames);
          }}
          onEdit={(g) => setEditGame(g)}
        />
      ) : (
        <Collections userId={user?.id} games={games} visibleOnly />
      )}
      {view === "games" && (
        <div className="toolbar">
          <button className="btn" disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))}>Página anterior</button>
          <span>Página {page} de {Math.max(1, Math.ceil(games.filter(g => g.titulo.toLowerCase().includes(q.toLowerCase())).length / pageSize))}</span>
          <button className="btn" disabled={page>=Math.ceil(games.filter(g => g.titulo.toLowerCase().includes(q.toLowerCase())).length / pageSize)} onClick={() => setPage(p => p+1)}>Siguiente página</button>
        </div>
      )}
      <button className="fab-secondary" onClick={() => { const name = prompt("Nombre de la colección"); if (name) { const raw = localStorage.getItem(`collections_${user?.id}`) || "[]"; const cols = JSON.parse(raw); cols.push({ id: Math.random().toString(36).slice(2), name, gameIds: [] }); localStorage.setItem(`collections_${user?.id}`, JSON.stringify(cols)); } }}>📁</button>
      <button className="fab" onClick={() => setShowForm(true)}>＋</button>
    </div>
  );
}
