import React, { useMemo, useState } from "react";

export default function AddToCollection({ userId, collectionId, games = [], onUpdated }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const cols = JSON.parse(localStorage.getItem(`collections_${userId}`) || "[]");
  const col = cols.find(c => c.id === collectionId);
  const existing = new Set(col?.gameIds || []);
  const candidates = useMemo(() => games.filter(g => g.titulo.toLowerCase().includes(q.toLowerCase()) && !existing.has(g._id)), [games, q, collectionId]);
  const totalPages = Math.max(1, Math.ceil(candidates.length / pageSize));
  const visible = candidates.slice((page-1)*pageSize, (page-1)*pageSize + pageSize);

  function add(id) {
    const next = cols.map(c => c.id === collectionId ? { ...c, gameIds: Array.from(new Set([...(c.gameIds||[]), id])) } : c);
    localStorage.setItem(`collections_${userId}`, JSON.stringify(next));
    setPage(1);
    if (onUpdated) onUpdated(next, { close: true });
  }

  return (
    <div>
      <div className="toolbar controls">
        <div className="input-with-icon"><input className="control-input" placeholder="Buscar juego..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} /></div>
      </div>
      {visible.length ? (
        <div className="grid">
          {visible.map(g => (
            <div key={g._id} className="game-card">
              <img src={(g.portadaUrl && String(g.portadaUrl).trim()) ? g.portadaUrl : "/placeholder.svg"} alt={g.titulo} className="card-cover" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
              <h4 className="card-title">{g.titulo}</h4>
              <p className="card-meta">{g.plataforma}</p>
              <button className="btn btn-primary" onClick={() => add(g._id)}>Agregar</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay resultados para añadir.</p>
      )}
      <div className="toolbar pagination">
        <button className="btn" disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))}>Página anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button className="btn" disabled={page>=totalPages} onClick={() => setPage(p => p+1)}>Siguiente página</button>
      </div>
    </div>
  );
}