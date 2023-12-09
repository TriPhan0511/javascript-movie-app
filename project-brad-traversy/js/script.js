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
  results.forEach(
    ({ id, poster_path, name: title, first_air_date: release_date }) => {
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
      document.querySelector('#popular-shows')?.appendChild(div)
    }
  )
}

async function displayPopularShows1() {
  const { results } = await fetchAPIData('tv/popular')
  results.forEach(({ id, poster_path, name, first_air_date }) => {
    const imgSrc = poster_path
      ? `https://image.tmdb.org/t/p/w500/${poster_path}`
      : 'images/no-image.jpg'
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
        <div class="card">
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
              <small class="text-muted">Aired: ${new Date(
                first_air_date
              ).toLocaleDateString()}</small>
            </p>
          </div>
        </div>
      `
    document.querySelector('#popular-shows')?.appendChild(div)
  })
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
      break
    case '/tv-details.html':
      console.log('TV Details')
      break
    case '/search.html':
      console.log('Search')
      break
  }

  highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)
