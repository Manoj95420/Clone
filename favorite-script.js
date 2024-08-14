document.addEventListener('DOMContentLoaded', function() {
    displayFavoriteMovies();
    const deleteButton = document.getElementById('delete-button');
    deleteButton.addEventListener('click', clearFavorites);
});

function displayFavoriteMovies() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const favoriteMoviesContainer = document.getElementById('favorite-movies');
    favoriteMoviesContainer.innerHTML = ''; // Clear existing content

    favorites.forEach((movie, index) => {
        const movieElement = createMovieElement(movie, index);
        favoriteMoviesContainer.appendChild(movieElement);
    });
}

function createMovieElement(movie, index) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('col-lg-4', 'col-md-6', 'mb-4');

    movieElement.innerHTML = `
        <div class="card h-100">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'image_not_found.png'}" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">${movie.Plot}</p>
                <a href="Movie page.html?id=${movie.imdbID}" class="btn btn-primary stretched-link">View Details</a>
                <button class="btn btn-danger delete-icon" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `;

    movieElement.querySelector('.delete-icon').addEventListener('click', function(event) {
        event.stopPropagation();
        const movieIndex = this.getAttribute('data-index');
        removeFromFavorites(movieIndex);
    });

    return movieElement;
}

function clearFavorites() {
    window.alert('Deleting all the favorite movies, click on OK to proceed!');
    localStorage.removeItem('favorites');
    displayFavoriteMovies();
}

function removeFromFavorites(index) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavoriteMovies();
}
