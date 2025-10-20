// File: public/app.js

const API_BASE_URL = "http://localhost:3000"; // backend locale
let accessToken = null;
let refreshToken = null;

// --- Utility ---
function showMessage(text, type = "info") {
  const msg = document.getElementById("messages");
  msg.textContent = text;
  msg.style.color = type === "error" ? "red" : "green";
  setTimeout(() => (msg.textContent = ""), 4000);
}

// --- FUNZIONE GENERICA PER FETCH PROTETTO ---
async function authFetch(url, options = {}) {
  if (!options.headers) options.headers = {};
  if (accessToken) options.headers['Authorization'] = `Bearer ${accessToken}`;

  let res = await fetch(url, options);

  // Se token scaduto, prova a rinnovarlo
  if (res.status === 403 && refreshToken) {
    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      accessToken = refreshData.accessToken;
      // Ritenta la richiesta originale con nuovo token
      options.headers['Authorization'] = `Bearer ${accessToken}`;
      res = await fetch(url, options);
    }
  }

  return res;
}

// --- LOGIN ---
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore di login");

    accessToken = data.accessToken;
    refreshToken = data.refreshToken;

    showMessage("Login riuscito!");
    document.getElementById("authSection").classList.add("hidden");
    document.getElementById("profileSection").classList.remove("hidden");
    document.getElementById("tmdbSection").classList.remove("hidden");
    document.getElementById("moviesSection").classList.remove("hidden");

    getProfile();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

// --- REGISTRAZIONE ---
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Errore registrazione');

    showMessage('Registrazione riuscita! Puoi ora effettuare il login.');
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

// --- PROFILO ---
async function getProfile() {
  try {
    const res = await authFetch(`${API_BASE_URL}/auth/profile`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore nel recupero profilo");

    document.getElementById("profileData").textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// --- LOGOUT ---
document.getElementById("logoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const refreshToken = document.getElementById("hiddenRefreshToken").value;

    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore logout");

    // Reset token e interfaccia
    accessToken = null;
    refreshToken = null;
    document.getElementById("profileSection").classList.add("hidden");
    document.getElementById("authSection").classList.remove("hidden");
    document.getElementById("profileData").textContent = "";
    document.getElementById("results").innerHTML = "";
    document.getElementById("moviesList").innerHTML = "";

    showMessage("Logout effettuato con successo!");

    // Opzionale: ricarica pagina
    window.location.reload();
  } catch (error) {
    showMessage(error.message, "error");
  }
});



// --- RICERCA FILM SU TMDB ---
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = document.getElementById("query").value.trim();
  if (!query) return showMessage("Inserisci una parola chiave per la ricerca", "error");

  try {
    const res = await authFetch(`${API_BASE_URL}/api/tmdb/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore ricerca TMDB");

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (data.length === 0) {
      resultsDiv.innerHTML = "<p>Nessun film trovato.</p>";
      return;
    }

    data.forEach((movie) => {
      const div = document.createElement("div");
      div.classList.add("movie-card");

      const poster = movie.poster_url || "https://via.placeholder.com/300x450?text=Nessuna+Immagine";

      div.innerHTML = `
        <img src="${poster}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <div class="movie-info">
          <span class="director">Regista: ${movie.director || "N/D"}</span>
          <span class="release">Uscita: ${movie.release_date || "N/D"}</span>
        </div>
        <p>${movie.overview || "Nessuna descrizione disponibile"}</p>
      `;
      resultsDiv.appendChild(div);
    });
  } catch (error) {
    showMessage(error.message, "error");
  }
});

// --- CARICA FILM DAL DATABASE LOCALE ---
document.getElementById("btnLoadMovies").addEventListener("click", async () => {
  try {
    const res = await authFetch(`${API_BASE_URL}/api/movies`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore caricamento film");

    const moviesList = document.getElementById("moviesList");
    moviesList.innerHTML = "";

    if (data.length === 0) {
      moviesList.innerHTML = "<p>Nessun film salvato nel database.</p>";
      return;
    }

    data.forEach((movie) => {
      const div = document.createElement("div");
      div.classList.add("movie-card");

      const poster = movie.poster_path || "https://via.placeholder.com/300x450?text=Nessuna+Immagine";

      div.innerHTML = `
        <img src="${poster}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <div class="movie-info">
          <span class="genre">Genere: ${movie.genre || "N/D"}</span>
          <span class="director">Regista: ${movie.director || "N/D"}</span>
          <span class="release">Uscita: ${movie.release_date || "N/D"}</span>
        </div>
        <p>${movie.description || ""}</p>
      `;
      moviesList.appendChild(div);
    });
  } catch (error) {
    showMessage(error.message, "error");
  }
});
