import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserReviews } from "../api/api";

export default function PublicProfile() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const avatar = localStorage.getItem(`avatar_${id}`) || "";

  useEffect(() => {
    fetchUserReviews(id).then(setReviews);
  }, [id]);

  const name = reviews[0]?.autor?.nombre || "Usuario";
  const stats = useMemo(() => ({ totalReseñas: reviews.length }), [reviews]);

  return (
    <div>
      <h2>Perfil de {name}</h2>
      <div style={{display:'grid', gridTemplateColumns:'220px 1fr', gap:24}}>
        <div>
          <div style={{ width:160, height:160, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.15)', background:'#2a2a3a', overflow:'hidden', margin:'0 auto' }}>
            {avatar ? <img src={avatar} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <div style={{color:'#888',display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}>{(name||'U').slice(0,2)}</div>}
          </div>
          <div style={{textAlign:'center', marginTop:10}}>
            <div style={{fontSize:20, fontWeight:800}}>{name}</div>
            <div style={{color:'#9aa3b7', fontSize:13}}>Miembro</div>
            <div style={{marginTop:12, display:'flex', gap:10, justifyContent:'center'}}>
              <button className="btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>Compartir perfil</button>
            </div>
          </div>
        </div>
        <div>
          <div className="stats-panel">
            <p><span className="stats-label">Reseñas hechas</span><span className="stats-value"> {stats.totalReseñas}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}