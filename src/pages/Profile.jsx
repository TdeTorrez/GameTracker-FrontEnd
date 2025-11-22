import React, { useEffect, useState } from "react";
import { fetchMyGames, deleteGame } from "../api/api";
import Library from "../components/Library";
import GameForm from "../components/GameForm";
import Popup from "../components/Popup";
import Stats from "../components/Stats";
import CollectionForm from "../components/CollectionForm";
import AddToCollection from "../components/AddToCollection";


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
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editCollection, setEditCollection] = useState(null);
  const [confirmRemoveFromCollectionId, setConfirmRemoveFromCollectionId] = useState(null);
  const [confirmDeleteCollectionId, setConfirmDeleteCollectionId] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchMyGames(token).then(setGames);
    const t = setInterval(() => fetchMyGames(token).then(setGames), 60000);
    return () => clearInterval(t);
  }, [token]);

  useEffect(() => {
    const raw = localStorage.getItem(`collections_${user?.id}`) || "[]";
    try { setCollections(JSON.parse(raw)); } catch { setCollections([]); }
  }, [user?.id]);

  if (!token) return <p>Debes iniciar sesión para ver tu biblioteca.</p>;

  return (
    <div>
      <h2>Mi Biblioteca</h2>
      <div className="profile-layout">
        <aside className="sidebar">
          <h3 style={{marginTop:0}}>Colecciones</h3>
          {collections.length ? (
            collections.map(c => (
              <div key={c.id} className="collection-row">
                <button
                  className={`side-item ${selectedCollectionId === c.id ? 'active' : ''}`}
                  onClick={() => { setSelectedCollectionId(c.id); setPage(1); }}
                  style={{flex:1}}
                >
                  {c.name}
                </button>
                <button
                  className="side-action icon-edit"
                  aria-label="Editar colección"
                  title="Editar colección"
                  onClick={() => setEditCollection(c)}
                >
                  ✎
                </button>
                <button
                  className="side-action icon-trash"
                  aria-label="Borrar colección"
                  title="Borrar colección"
                  onClick={() => setConfirmDeleteCollectionId(c.id)}
                >
                  🗑
                </button>
              </div>
            ))
          ) : (
            <div>No hay colecciones</div>
          )}
          {selectedCollectionId && (
            <button className="side-item" onClick={() => { setSelectedCollectionId(null); setPage(1); }}>Ver toda la biblioteca</button>
          )}
        </aside>
        <div className="main-content">
      <div className="toolbar controls">
        {view === "games" && (
          <>
            <div className="input-with-icon"><input className="control-input" placeholder="Buscar..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} /></div>
            <select className="control-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="recent">Más recientes</option>
              <option value="rating">Mejor puntuados</option>
              <option value="hours">Más horas</option>
            </select>
            {selectedCollectionId && (
              <button className="btn btn-secondary" onClick={() => setShowAddToCollection(true)}>Añadir juegos a esta colección</button>
            )}
            <select className="control-select" value={platform} onChange={e => setPlatform(e.target.value)}>
              <option value="">Todas las plataformas</option>
              {Array.from(new Set(games.map(g => (g.plataforma || "").trim()).filter(Boolean))).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </>
        )}
        
      </div>
      <Popup open={showForm || !!editGame} title={editGame ? "Editar juego" : "Nuevo juego"} onClose={() => { setShowForm(false); setEditGame(null); }}>
        <GameForm initial={editGame || {}} token={token} onSaved={() => { setShowForm(false); setEditGame(null); fetchMyGames(token).then(setGames); }} />
      </Popup>
      <Popup open={showCollectionForm} title="Nueva colección" onClose={() => setShowCollectionForm(false)}>
        <CollectionForm userId={user?.id} onCreated={(next) => { setCollections(next); setShowCollectionForm(false); }} />
      </Popup>
      <Popup open={showAddToCollection} title="Añadir juegos a la colección" onClose={() => setShowAddToCollection(false)}>
        <AddToCollection userId={user?.id} collectionId={selectedCollectionId} games={games} onUpdated={(next, opts) => { setCollections(next); if (opts?.close) setShowAddToCollection(false); }} />
      </Popup>
      {/* Juegos filtrados segun contexto */}
      {(() => {
        const filtered = [...games]
          .filter(g => g.titulo.toLowerCase().includes(q.toLowerCase()))
          .filter(g => platform ? (g.plataforma || "").toLowerCase().includes(platform.toLowerCase()) : true)
          .filter(g => selectedCollectionId ? ((collections.find(c => c.id === selectedCollectionId)?.gameIds || []).includes(g._id)) : true)
          .sort((a,b) => (sort === "rating") ? (b.puntuacionPromedio||0)-(a.puntuacionPromedio||0) : (sort === "hours") ? (b.horasJugadas||0)-(a.horasJugadas||0) : 0);
        return (<div className="stats-panel"><Stats games={filtered} /></div>);
      })()}
      {view === "games" ? (
        <Library
          games={[...games]
            .filter(g => g.titulo.toLowerCase().includes(q.toLowerCase()))
            .filter(g => platform ? (g.plataforma || "").toLowerCase().includes(platform.toLowerCase()) : true)
            .filter(g => selectedCollectionId ? ((collections.find(c => c.id === selectedCollectionId)?.gameIds || []).includes(g._id)) : true)
            .sort((a,b) => (sort === "rating") ? (b.puntuacionPromedio||0)-(a.puntuacionPromedio||0) : (sort === "hours") ? (b.horasJugadas||0)-(a.horasJugadas||0) : 0)
            .slice((page-1)*pageSize, (page-1)*pageSize + pageSize)
          }
          personal
          token={token}
          onDelete={(id) => {
            if (selectedCollectionId) setConfirmRemoveFromCollectionId(id);
            else setConfirmDeleteId(id);
          }}
          onEdit={(g) => setEditGame(g)}
          emptyMessage={selectedCollectionId ? "Esta coleccion aun no tiene juegos" : undefined}
        />
      ) : (
        <Collections userId={user?.id} games={games} visibleOnly />
      )}
      {view === "games" && (
        <div className="toolbar pagination">
          <button className="btn" disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))}>Página anterior</button>
          <span>Página {page} de {Math.max(1, Math.ceil(games.filter(g => g.titulo.toLowerCase().includes(q.toLowerCase())).length / pageSize))}</span>
          <button className="btn" disabled={page>=Math.ceil(games.filter(g => g.titulo.toLowerCase().includes(q.toLowerCase())).length / pageSize)} onClick={() => setPage(p => p+1)}>Siguiente página</button>
        </div>
      )}
      <div className="fab-stack">
        <button className="fab" title="Agregar Juego" onClick={() => setShowForm(true)}>＋</button>
        <button className="fab-secondary" title="Agregar Colección" onClick={() => setShowCollectionForm(true)}>📁</button>
      </div>
      {/* Confirmación de borrado */}
      <Popup open={!!confirmDeleteId} title="Confirmar borrado" onClose={() => setConfirmDeleteId(null)}>
        <p>¿Seguro que deseas borrar este juego?</p>
        <div className="toolbar">
          <button className="btn btn-primary" onClick={async () => {
            try {
              const id = confirmDeleteId;
              await deleteGame(id, token);
              setGames(gs => gs.filter(g => g._id !== id));
              setConfirmDeleteId(null);
            } catch (e) {
              alert(e?.message || "No se pudo borrar el juego");
            }
          }}>Borrar</button>
          <button className="btn" onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
        </div>
      </Popup>
      {/* Quitar juego de la colección actual */}
      <Popup open={!!confirmRemoveFromCollectionId} title="Quitar de la colección" onClose={() => setConfirmRemoveFromCollectionId(null)}>
        <p>¿Quieres quitar este juego de la colección seleccionada? No se borrará de tu biblioteca.</p>
        <div className="toolbar">
          <button className="btn btn-primary" onClick={() => {
            const id = confirmRemoveFromCollectionId;
            const next = collections.map(c => c.id === selectedCollectionId ? { ...c, gameIds: (c.gameIds||[]).filter(gid => gid !== id) } : c);
            localStorage.setItem(`collections_${user?.id}`, JSON.stringify(next));
            setCollections(next);
            setConfirmRemoveFromCollectionId(null);
          }}>Quitar</button>
          <button className="btn" onClick={() => setConfirmRemoveFromCollectionId(null)}>Cancelar</button>
        </div>
      </Popup>
      {/* Confirmación de borrar colección */}
      <Popup open={!!confirmDeleteCollectionId} title="Eliminar colección" onClose={() => setConfirmDeleteCollectionId(null)}>
        <p>¿Seguro que deseas eliminar esta colección? No se borrarán los juegos, solo la colección.</p>
        <div className="toolbar">
          <button className="btn btn-primary" onClick={() => {
            const next = collections.filter(x => x.id !== confirmDeleteCollectionId);
            localStorage.setItem(`collections_${user?.id}`, JSON.stringify(next));
            setCollections(next);
            if (selectedCollectionId === confirmDeleteCollectionId) setSelectedCollectionId(null);
            setConfirmDeleteCollectionId(null);
          }}>Eliminar</button>
          <button className="btn" onClick={() => setConfirmDeleteCollectionId(null)}>Cancelar</button>
        </div>
      </Popup>
      {/* Edición de colección */}
      <Popup open={!!editCollection} title="Renombrar colección" onClose={() => setEditCollection(null)}>
        {editCollection && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const newName = form.elements.namedItem('name').value.trim();
            if (!newName) return;
            const next = collections.map(x => x.id === editCollection.id ? { ...x, name: newName } : x);
            localStorage.setItem(`collections_${user?.id}`, JSON.stringify(next));
            setCollections(next);
            setEditCollection(null);
          }}>
            <input name="name" defaultValue={editCollection.name} placeholder="Nuevo nombre" />
            <div className="toolbar">
              <button type="submit" className="btn btn-primary">Guardar</button>
              <button type="button" className="btn" onClick={() => setEditCollection(null)}>Cancelar</button>
            </div>
          </form>
        )}
      </Popup>
        </div>
      </div>
    </div>
  );
}
