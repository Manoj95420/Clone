const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=542781d9`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}">
        </div>
        <div class="search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
            <button class="btn btn-warning favorite-icon" data-id="${movies[idx].imdbID}" data-title="${movies[idx].Title}" data-poster="${moviePoster}" data-year="${movies[idx].Year}"><i class="fa-solid fa-heart"></i> Add to Favorites</button>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async (event) => {
            if (event.target.classList.contains('favorite-icon')) {
                event.stopPropagation();
                addToFavorites(event.target.dataset);
                return;
            }
            const movieId = movie.dataset.id;
            const result = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=542781d9`);
            const movieDetails = await result.json();
            // Redirect to movie.html with query parameters
            window.location.href = `Movie page.html?id=${movieId}`;
        });
    });
}

function addToFavorites(movie) {
    const favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];
    const existingIndex = favoriteMovies.findIndex(favMovie => favMovie.imdbID === movie.id);
    if (existingIndex === -1) {
        favoriteMovies.push({
            imdbID: movie.id,
            Title: movie.title,
            Poster: movie.poster,
            Year: movie.year
        });
        localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
        alert('Movie added to favorites!');
    } else {
        alert('Movie is already in favorites.');
    }
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});
