const API_URL = (import.meta.env?.VITE_API_URL) || "http://localhost:4000/api";

async function request(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  if (res.status === 204) return { ok: true };
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.msg || `Error ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }
  if (!res.ok) {
    const err = new Error(`Error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return { ok: true };
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
export const fetchUserReviews = (userId) => request(`/reviews?author=${userId}`);
export const createReview = (data, token) => request("/reviews", "POST", data, token);
export const updateReview = (id, data, token) => request(`/reviews/${id}`, "PUT", data, token);
export const deleteReview = (id, token) => request(`/reviews/${id}`, "DELETE", null, token);
