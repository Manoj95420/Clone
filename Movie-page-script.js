document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId) {
        fetchMovieDetails(movieId);
    } else {
        // Handle case where no movieId is provided
        console.error('No movie ID provided');
    }
});

async function fetchMovieDetails(movieId) {
    const URL = `https://www.omdbapi.com/?i=${movieId}&apikey=542781d9`;
    try {
        const response = await fetch(URL);
        const data = await response.json();
        displayMovieDetails(data);
        updateFavoriteButton(movieId); // Check and update favorite button state
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function displayMovieDetails(details) {
    const resultGrid = document.getElementById('result-grid');
    resultGrid.innerHTML = `
        <div class="movie-poster d-inline-block">
            <img src="${details.Poster !== 'N/A' ? details.Poster : 'image_not_found.png'}" alt="movie poster">
        </div>
        <button type="button" id="favorite-button" class="btn btn-success rounded-pill">Add to favourites</button> 
        <div class="movie-info d-inline-block">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
    const favoriteButton = document.getElementById('favorite-button');
    favoriteButton.addEventListener('click', () => toggleFavorite(details));
}

function toggleFavorite(details) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const movieId = details.imdbID;

    const index = favorites.findIndex(movie => movie.imdbID === movieId);

    if (index === -1) {
        // Movie not in favorites, add it
        favorites.push(details);
    } else {
        // Movie already in favorites, remove it
        favorites.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(movieId);
}

function updateFavoriteButton(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteButton = document.getElementById('favorite-button');

    if (favorites.some(movie => movie.imdbID === movieId)) {
        favoriteButton.textContent = 'Remove from favorites';
    } else {
        favoriteButton.textContent = 'Add to favorites';
    }
}



// function adjustHomeButtonPosition() {
//     const homeButton = document.getElementById('home-button');
//     if (homeButton) {
//         // Adjust margin-top or padding-top as needed
//         homeButton.style.marginTop = '300px'; // Example: Adjust margin-top by 20px
//     }
// }
