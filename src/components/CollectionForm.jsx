import React, { useState } from "react";

export default function CollectionForm({ userId, onCreated }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const raw = localStorage.getItem(`collections_${userId}`) || "[]";
    const cols = JSON.parse(raw);
    const id = Math.random().toString(36).slice(2);
    const next = [...cols, { id, name: name.trim(), gameIds: [] }];
    localStorage.setItem(`collections_${userId}`, JSON.stringify(next));
    setName("");
    if (onCreated) onCreated(next);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nombre de la colección" value={name} onChange={e => setName(e.target.value)} />
      <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Crear colección</button>
    </form>
  );
}