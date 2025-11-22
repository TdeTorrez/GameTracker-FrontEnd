import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchMyGames, fetchUserReviews } from "../api/api";
import Popup from "../components/Popup";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const [games, setGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avatar, setAvatar] = useState(localStorage.getItem(`avatar_${user?.id}`) || "");
  const [favOpen, setFavOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    if (!token || !user) return;
    fetchMyGames(token).then(setGames);
    fetchUserReviews(user.id).then(setReviews);
  }, [token, user?.id]);

  const stats = useMemo(() => {
    const totalHoras = games.reduce((s, g) => s + (g.horasJugadas || 0), 0);
    const totalJuegos = games.length;
    const totalReseñas = reviews.length;
    return { totalHoras, totalJuegos, totalReseñas };
  }, [games, reviews]);

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      setAvatar(String(data));
      localStorage.setItem(`avatar_${user?.id}`, String(data));
    };
    reader.readAsDataURL(file);
  }

  function prevent(e) { e.preventDefault(); }

  const favs = useMemo(() => {
    const onlyFavs = reviews.filter(r => !!r.favorita);
    const filtered = onlyFavs.filter(r => q ? ((r.contenido||"").toLowerCase().includes(q.toLowerCase()) || (r.titulo||"").toLowerCase().includes(q.toLowerCase())) : true);
    const sorted = filtered.sort((a,b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "stars_desc") return (b.estrellas||0) - (a.estrellas||0);
      if (sort === "stars_asc") return (a.estrellas||0) - (b.estrellas||0);
      return 0;
    });
    const start = (page-1)*pageSize;
    return { visible: sorted.slice(start, start+pageSize), total: sorted.length };
  }, [reviews, q, sort, page]);

  if (!user) return <p>Debes iniciar sesión para ver tu perfil.</p>;

  return (
    <div>
      <h2>Perfil</h2>
      <div style={{display:'grid', gridTemplateColumns:'220px 1fr', gap:24, alignItems:'start'}}>
        <div>
          <div
            style={{ width:160, height:160, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.15)', background:'#2a2a3a', overflow:'hidden', margin:'0 auto' }}
            onDragOver={prevent}
            onDrop={handleDrop}
            title="Arrastra una imagen aquí para tu avatar"
          >
            {avatar ? <img src={avatar} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <div style={{color:'#888',display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}>Arrastra tu foto</div>}
          </div>
          <div style={{textAlign:'center', marginTop:10}}>
            <div style={{fontSize:20, fontWeight:800}}>{user?.nombre || 'Usuario'}</div>
            <div style={{color:'#9aa3b7', fontSize:13}}>{"Jugador"}</div>
            <div style={{marginTop:12, display:'flex', gap:10, justifyContent:'center'}}>
              <button className="btn" onClick={() => {
                navigator.clipboard.writeText(window.location.origin + '/user/' + user.id);
                alert('¡Enlace del perfil copiado al portapapeles!');
              }}>Compartir perfil</button>
              <button className="btn btn-danger" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); location.href='/'; }}>Cerrar sesión</button>
            </div>
          </div>
        </div>
        <div>
          <div className="stats-panel">
            <p><span className="stats-label">Juegos</span><span className="stats-value"> {stats.totalJuegos}</span></p>
            <p><span className="stats-label">Horas jugadas totales</span><span className="stats-value"> {stats.totalHoras}</span></p>
            <p><span className="stats-label">Reseñas hechas</span><span className="stats-value"> {stats.totalReseñas}</span></p>
          </div>
          <button className="btn btn-secondary" onClick={() => setFavOpen(v => !v)}>Ver reseñas favoritas</button>
        </div>
      </div>
      <Popup open={favOpen} title="Reseñas favoritas" onClose={() => setFavOpen(false)}>
        <div className="toolbar controls" style={{gap: '12px'}}>
          <div className="input-with-icon">
            <input className="control-input" placeholder="Buscar reseña..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
          </div>
          <select className="control-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Recientes (Más nuevas)</option>
            <option value="oldest">Antiguas (Más antiguas)</option>
            <option value="stars_desc">Más estrellas</option>
            <option value="stars_asc">Menos estrellas</option>
          </select>
        </div>
        {favs.visible.length ? (
          <div className="review-list" style={{
            maxHeight: 'calc(100vh - 300px)',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.15) transparent'
          }}>
            {favs.visible.map(r => {
              const game = games.find(g => g._id === r.juego);
              const recommended = (r.estrellas || 0) >= 3;
              return (
                <div key={r._id} className="review-card" style={{
                  borderRadius: '10px',
                  padding: '15px 20px',
                  marginBottom: '15px',
                  background: '#2a2a3a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  position: 'relative'
                }}>
                  <div className="review-top" style={{marginBottom: '10px'}}>
                    <div className={`badge ${recommended ? 'recommend' : 'not-recommend'}`}>
                      {recommended ? '👍 Recomendado' : '👎 No recomendado'}
                    </div>
                    <div className="review-author" style={{color: '#f0f0f0', fontWeight: 'bold'}}>{r.autor?.nombre || 'Yo'}</div>
                  </div>
                  {game?.titulo && <div className="review-game-title" style={{color: '#f0f0f0', fontWeight: 'bold', marginBottom: '8px'}}>{game.titulo}</div>}
                  {r.titulo && <div className="review-title" style={{color: '#f0f0f0', fontWeight: 'bold', marginBottom: '8px'}}>{r.titulo}</div>}
                  <div className="review-content" style={{color: '#a8b1c7', margin: '8px 0'}}>{r.contenido}</div>
                </div>
              );
            })}
          </div>
        ) : (<p style={{color: '#a8b1c7'}}>No hay reseñas favoritas.</p>)}
        <div className="pagination" style={{display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginTop: '16px'}}>
          <button className="btn" disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))}>Página anterior</button>
          <span style={{color: '#f0f0f0', fontWeight: 'bold'}}>Página {page} de {Math.max(1, Math.ceil(favs.total / pageSize))}</span>
          <button className="btn" disabled={page >= Math.ceil(favs.total / pageSize)} onClick={() => setPage(p => p+1)}>Siguiente página</button>
        </div>
      </Popup>
    </div>
  );
}