const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

async function request(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  return res.json();
}

export const register = (data) => request("/auth/register", "POST", data);
export const login = (data) => request("/auth/login", "POST", data);
export const fetchGames = (q) => request(q ? `/games?q=${encodeURIComponent(q)}` : "/games");
export const fetchMyGames = (token) => request("/games/mine", "GET", null, token);
export const fetchGame = (id) => request(`/games/${id}`);
export const createGame = (data, token) => request("/games", "POST", data, token);
export const updateGame = (id, data, token) => request(`/games/${id}`, "PUT", data, token);
export const deleteGame = (id, token) => request(`/games/${id}`, "DELETE", null, token);

export const fetchReviews = (gameId) => request(`/reviews?game=${gameId}`);
export const createReview = (data, token) => request("/reviews", "POST", data, token);
export const updateReview = (id, data, token) => request(`/reviews/${id}`, "PUT", data, token);
export const deleteReview = (id, token) => request(`/reviews/${id}`, "DELETE", null, token);
