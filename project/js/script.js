// Fetch Data
// Popular movies
// `https://api.themoviedb.org/3/movie/popular?language=en-US`
// Popular TV Shows
// `https://api.themoviedb.org/3/tv/popular?language=en-US`
// Movie Details
// `https://api.themoviedb.org/3/movie/movie_id?language=en-US`
// TV Show Details
// `https://api.themoviedb.org/3/tv/series_id?language=en-US`
// Now playing
// `https://api.themoviedb.org/3/movie/movie/now_playing?language=en-US`
// Search Movie/Show
// https://api.themoviedb.org/3/search/movie?language=en-US&query=$freelance&page=1
// https://api.themoviedb.org/3/search/tv?language=en-US&query=$freelance&page=1

// const API_KEY = '72597d8d62e1a0cc5f6e35a022fa82ea'

// --------------------------------------------------------------------------------------

// Global states
const global = {
  api_key: '72597d8d62e1a0cc5f6e35a022fa82ea',
  imagePath: 'https://image.tmdb.org/t/p/',
}

function init() {
  switch (window.location.pathname) {
    case '/':
    case '/index.html':
      displayPopularMovies()
      break
    case '/shows.html':
      displayPopularShows()
      break
    case '/movie-details.html':
      console.log('Movie Details')
      displayMovieDetails('movie/897087')
      // displayMovieDetails('movie/movie_id')
      // 897087
      break
    case '/tv-details.html':
      console.log('Show Details')
      break
    case '/search.html':
      console.log('Search')
      break
  }
  activeLink()
}

// Fectch data from https://themoviedb.org
async function fetchData(endpoint = 'movie/popular') {
  let response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?api_key=${global.api_key}&language=en-US`
  )
  response = await response.json()
  return response
}

// Display popular movies
async function displayPopularMovies() {
  const { results } = await fetchData('movie/popular')
  results.forEach(({ id, title, poster_path, release_date }) => {
    const link = `movie-details.html?id=${id}`
    const imgSrc = poster_path
      ? `${global.imagePath}w500${poster_path}`
      : '/images/no-image.jpg'
    const releaseDateString = `Release Date: ${new Date(
      release_date
    ).toLocaleDateString()}`
    const card = createCard(link, title, imgSrc, releaseDateString)
    document.querySelector('#popular-movies')?.appendChild(card)
  })
}

// Display popular tv shows
async function displayPopularShows() {
  const { results } = await fetchData('tv/popular')
  results.forEach(({ id, name, poster_path, first_air_date }) => {
    const link = `tv-details.html?id=${id}`
    const imgSrc = poster_path
      ? `${global.imagePath}w500${poster_path}`
      : '/images/no-image.jpg'
    const releaseDateString = `First Air Date: ${new Date(
      first_air_date
    ).toLocaleDateString()}`
    const card = createCard(link, name, imgSrc, releaseDateString)
    document.querySelector('#popular-shows')?.appendChild(card)
  })
}

// Display movie details
async function displayMovieDetails(endpoint) {
  const res = await fetchData(endpoint)
  // console.log(res)
  const div = document.createElement('div')
  div.appendChild(createDetailsTop())
  div.appendChild(createDetailsTBottom())
  document.querySelector('#movie-details')?.appendChild(div)
}

// UTILITY FUNCTIONS

// Activate link
function activeLink() {
  const pathName = window.location.pathname
  if (pathName === '/index.html') {
    document.querySelector('.nav-link')?.classList.add('active')
  }
  document.querySelectorAll('.nav-link').forEach((el) => {
    if (el.getAttribute('href') === pathName) {
      el.classList.add('active')
    }
  })
}

// Create a card
function createCard(link, title, imgSrc, releaseDateString) {
  const div = document.createElement('div')
  div.classList.add('card')
  div.innerHTML = `
    <a href="${link}"
      ><img
        src="${imgSrc}"
        alt="${title}"
        class="card-img-top"
    /></a>
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">
        <small class="text-muted">${releaseDateString}</small>
      </p>
    </div>
  `
  return div
}

// Create details top
function createDetailsTop(
  imgSrc,
  title,
  voteAverage,
  releaseDateString,
  overview,
  homePageLink,
  genres
) {
  const div = document.createElement('div')
  div.classList.add('details-top')
  div.innerHTML = `
    <div>
      <img
        src="${imgSrc}"
        alt="${title}"
        class="card-img-top"
      />
    </div>
    <div>
      <h2>${title}</h2>
      <p><i class="fas fa-star text-primary"></i> ${voteAverage} / 10</p>
      <p class="text-muted">${releaseDateString}</p>
      <p>${overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${genres.map((g) => `<li>${g.name}</li>`)}.join(', )
      </ul>
      <a href="${homePageLink}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  `
  return div
}

// Create details bottom
function createDetailsTBottom() {
  const div = document.createElement('div')
  div.classList.add('details-bottom')
  div.innerHTML = `
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $1,000,000</li>
        <li><span class="text-secondary">Revenue:</span> $2,000,000</li>
        <li><span class="text-secondary">Runtime:</span> 90 minutes</li>
        <li><span class="text-secondary">Status:</span> Released</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">Company 1, Company 2, Company 3</div>
  `
  return div
}

// Add DOMContentLoaded event listener to document
document.addEventListener('DOMContentLoaded', init)
