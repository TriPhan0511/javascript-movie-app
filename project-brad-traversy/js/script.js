const global = {
  currentPage: window.location.pathname,
}

// Display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular')
  results.forEach(({ id, poster_path, title, release_date }) => {
    const imgSrc = poster_path
      ? `https://image.tmdb.org/t/p/w500/${poster_path}`
      : 'images/no-image.jpg'
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="movie-details.html?id=${id}">
      <img
        src="${imgSrc}"
        class="card-img-top"
        alt="${title}"
      />
      </a>
      <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${new Date(
          release_date
        ).toLocaleDateString()}</small>
      </p>
      </div>
      `
    document.querySelector('#popular-movies')?.appendChild(div)
  })
}

// Display 20 most popular tv shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular')
  results.forEach(({ id, poster_path, name, first_air_date }) => {
    const imgSrc = poster_path
      ? `https://image.tmdb.org/t/p/w500/${poster_path}`
      : 'images/no-image.jpg'
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="tv-details.html?id=${id}">
      <img
        src="${imgSrc}"
        class="card-img-top"
        alt="${name}"
      />
      </a>
      <div class="card-body">
      <h5 class="card-title">${name}</h5>
      <p class="card-text">
        <small class="text-muted">Air Date: ${new Date(
          first_air_date
        ).toLocaleDateString()}</small>
      </p>
      </div>
      `
    document.querySelector('#popular-shows')?.appendChild(div)
  })
}

// Display Movie Details
async function displayMovieDetails() {
  // const movieId = window.location.search.split('=')[1]
  const movieId = new URLSearchParams(window.location.search).get('id')
  let {
    title,
    poster_path,
    vote_average,
    release_date,
    overview,
    genres,
    homepage,
    budget,
    revenue,
    runtime,
    status,
    production_companies,
    backdrop_path,
  } = await fetchAPIData(`movie/${movieId}`)
  // Overlay for background image
  displayBackgroundImage('movie', backdrop_path)
  // budget = `$${addCommasToNumber(budget)}`
  // revenue = `$${addCommasToNumber(revenue)}`
  const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })
  budget = currencyFormat.format(budget)
  revenue = currencyFormat.format(revenue)
  const imgSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500/${poster_path}`
    : '../images/no-image.jpg'
  const div = document.createElement('div')

  div.innerHTML = `
    <div class="details-top">
      <div>
        <img
          src="${imgSrc}"
          class="card-img-top"
          alt="${title}"
        />
      </div>
      <div>
        <h2>${title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${new Date(
          release_date
        ).toLocaleDateString()}</p>
        <p>${overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">
        ${genres.map((g) => `<li>${g.name}</li>`).join('')}
        </ul>
        <a href="${homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> ${budget}</li>
        <li><span class="text-secondary">Revenue:</span> ${revenue}</li>
        <li><span class="text-secondary">Runtime:</span> ${runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${production_companies
        .map((c) => `<span>${c.name}</span>`)
        .join(', ')}</div>
    </div>
  `
  document.querySelector('#movie-details')?.appendChild(div)
}

// Display Show Details
async function displayShowDetails() {
  const showId = new URLSearchParams(window.location.search).get('id')
  let {
    name,
    poster_path,
    vote_average,
    last_air_date,
    overview,
    genres,
    homepage,
    status,
    production_companies,
    backdrop_path,
    number_of_episodes,
    last_episode_to_air,
  } = await fetchAPIData(`tv/${showId}`)
  displayBackgroundImage('tv', backdrop_path) // Overlay for background image
  const imgSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500/${poster_path}`
    : '../images/no-image.jpg'

  const div = document.createElement('div')
  div.innerHTML = `
    <div class="details-top">
      <div>
        <img
          src="${imgSrc}"
          class="card-img-top"
          alt="${name}"
        />
      </div>
      <div>
        <h2>${name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Last Air Date: ${new Date(
          last_air_date
        ).toLocaleDateString()}</p>
        <p>${overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">
        ${genres.map((g) => `<li>${g.name}</li>`).join('')}
        </ul>
        <a href="${homepage}" target="_blank" class="btn">Visit Show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number Of Episodes:</span> ${number_of_episodes}</li>
        <li><span class="text-secondary">Last Episode To Air:</span> ${
          last_episode_to_air.name
        }</li>
        <li><span class="text-secondary">Status:</span> ${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${production_companies
        .map((c) => `<span>${c.name}</span>`)
        .join(', ')}</div>
    </div>
  `
  document.querySelector('#show-details')?.appendChild(div)
}

// Display Backdrop On Details Page
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div')
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
  overlayDiv.style.backgroundSize = 'cover'
  overlayDiv.style.backgroundPosition = 'center'
  overlayDiv.style.backgroundRepeat = 'no-repeat'
  overlayDiv.style.height = '100vh'
  overlayDiv.style.width = '100vw'
  overlayDiv.style.position = 'absolute'
  overlayDiv.style.top = '0'
  overlayDiv.style.left = '0'
  overlayDiv.style.zIndex = '-1'
  overlayDiv.style.opacity = '0.1'

  if (type === 'movie') {
    document.querySelector('#movie-details')?.appendChild(overlayDiv)
  } else {
    document.querySelector('#show-details')?.appendChild(overlayDiv)
  }
}

// Fetch data from the https://developer.themoviedb.org/docs API
async function fetchAPIData(endpoint) {
  const API_KEY = '72597d8d62e1a0cc5f6e35a022fa82ea'
  const API_URL = 'https://api.themoviedb.org/3/'
  showSpinner()
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  )
  const data = await response.json()
  hideSpinner()
  return data
}

function showSpinner() {
  document.querySelector('.spinner')?.classList?.add('show')
}

function hideSpinner() {
  document.querySelector('.spinner')?.classList?.remove('show')
}

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link')
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active')
    }
  })
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home')
      displayPopularMovies()
      break
    case '/shows.html':
      console.log('Shows')
      displayPopularShows()
      break
    case '/movie-details.html':
      console.log('Movie Details')
      displayMovieDetails()
      break
    case '/tv-details.html':
      displayShowDetails()
      console.log('TV Details')
      break
    case '/search.html':
      console.log('Search')
      break
  }

  highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)
