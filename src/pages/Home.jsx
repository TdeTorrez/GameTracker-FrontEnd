import React, { useEffect, useState } from "react";
import { fetchGames } from "../api/api";
import Library from "../components/Library";

export default function Home() {
  const [games, setGames] = useState([]);
  useEffect(() => { fetchGames().then(setGames); }, []);
  return (
    <div>
      <h2>Catálogo de juegos</h2>
      <Library games={games} />
    </div>
  );
}
