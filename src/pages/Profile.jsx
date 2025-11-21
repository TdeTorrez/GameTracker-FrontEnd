import React, { useEffect, useState } from "react";
import { fetchMyGames } from "../api/api";
import Library from "../components/Library";

export default function Profile() {
  const [games, setGames] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetchMyGames(token).then(setGames);
  }, [token]);

  if (!token) return <p>Debes iniciar sesión para ver tu biblioteca.</p>;

  return (
    <div>
      <h2>Mi Biblioteca</h2>
      <Library games={games} personal />
    </div>
  );
}
