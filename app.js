const API_KEY = "65d34a7c";

// ----------------- Home Page Logic -----------------
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

if (searchInput) {
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length < 3) {
      resultsDiv.innerHTML = "";
      return;
    }
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const data = await res.json();
    if (data.Search) {
      displaySearchResults(data.Search);
    } else {
      resultsDiv.innerHTML = "<p class='text-gray-600'>No results found.</p>";
    }
  });
  ("");
}

function displaySearchResults(movies) {
  resultsDiv.innerHTML = movies
    .map(
      (movie) => `
    <div class="bg-white p-3 rounded-lg shadow">
      <img src="${
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/150"
      }" class="w-full h-64 object-cover rounded"/>
      <h2 class="font-bold mt-2">${movie.Title}</h2>
      <p>${movie.Year}</p>
      <div class="flex justify-between mt-2">
        <button onclick="addToFavourites('${movie.imdbID}','${movie.Title}','${
        movie.Poster
      }','${movie.Year}')"
          class="px-2 py-1 bg-yellow-500 text-white rounded">⭐ Favourite</button>
        <a href="movie.html?id=${movie.imdbID}" 
          class="px-2 py-1 bg-blue-500 text-white rounded">ℹ️ Details</a>
      </div>
    </div>
  `
    )
    .join("");
}

// ----------------- Movie Page Logic -----------------
const movieDetailsDiv = document.getElementById("movieDetails");

if (movieDetailsDiv) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
      .then((res) => res.json())
      .then((movie) => {
        movieDetailsDiv.innerHTML = `
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <img src="${movie.Poster}" class="w-48 mb-4"/>
            <h1 class="text-3xl font-bold mb-2">${movie.Title} (${movie.Year})</h1>
            <p class="mb-2"><strong>Genre:</strong> ${movie.Genre}</p>
            <p class="mb-2"><strong>Director:</strong> ${movie.Director}</p>
            <p class="mb-2"><strong>Actors:</strong> ${movie.Actors}</p>
            <p class="mb-2"><strong>Plot:</strong> ${movie.Plot}</p>
          </div>
        `;
      });
  }
}

// ----------------- Favourites Logic -----------------
function addToFavourites(id, title, poster, year) {
  let favs = JSON.parse(localStorage.getItem("favourites")) || [];
  if (!favs.some((movie) => movie.id === id)) {
    favs.push({ id, title, poster, year });
    localStorage.setItem("favourites", JSON.stringify(favs));
    alert("Added to favourites!");
  } else {
    alert("Already in favourites!");
  }
}

const favouritesListDiv = document.getElementById("favouritesList");

if (favouritesListDiv) {
  let favs = JSON.parse(localStorage.getItem("favourites")) || [];
  if (favs.length === 0) {
    favouritesListDiv.innerHTML =
      "<p class='text-gray-600'>No favourites added yet.</p>";
  } else {
    favouritesListDiv.innerHTML = favs
      .map(
        (movie) => `
      <div class="bg-white p-3 rounded-lg shadow">
        <img src="${
          movie.poster !== "N/A"
            ? movie.poster
            : "https://via.placeholder.com/150"
        }" class="w-full h-64 object-cover rounded"/>
        <h2 class="font-bold mt-2">${movie.title}</h2>
        <p>${movie.year}</p>
        <button onclick="removeFromFavourites('${movie.id}')"
          class="mt-2 px-2 py-1 bg-red-500 text-white rounded">❌ Remove</button>
      </div>
    `
      )
      .join("");
  }
}

function removeFromFavourites(id) {
  let favs = JSON.parse(localStorage.getItem("favourites")) || [];
  favs = favs.filter((movie) => movie.id !== id);
  localStorage.setItem("favourites", JSON.stringify(favs));
  location.reload();
}
