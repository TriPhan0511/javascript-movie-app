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
  imageUrl: 'https://image.tmdb.org/t/p/',
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
      displayDetails('movie')
      break
    case '/tv-details.html':
      displayDetails('show')
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
      ? `${global.imageUrl}w500${poster_path}`
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
      ? `${global.imageUrl}w500${poster_path}`
      : '/images/no-image.jpg'
    const releaseDateString = `First Air Date: ${new Date(
      first_air_date
    ).toLocaleDateString()}`
    const card = createCard(link, name, imgSrc, releaseDateString)
    document.querySelector('#popular-shows')?.appendChild(card)
  })
}

// Display movie details
async function displayDetails(type = 'movie') {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  if (id) {
    const div = document.createElement('div')
    let targetDiv, result
    if (type === 'movie') {
      targetDiv = document.querySelector('#movie-details')
      result = await fetchData(`movie/${id}`)
      const details = [
        {
          text: 'budget',
          val: result.budget,
        },
        {
          text: 'revenue',
          val: result.revenue,
        },
        {
          text: 'runtime',
          val: result.runtime,
        },
        {
          text: 'status',
          val: result.status,
        },
      ]
      result = { ...result, details, type }
    } else if (type === 'show') {
      targetDiv = document.querySelector('#show-details')
      result = await fetchData(`tv/${id}`)
      const details = [
        {
          text: 'Number Of Episodes',
          val: result.number_of_episodes,
        },
        {
          text: 'Last Episode To Air',
          val: result.last_episode_to_air.name,
        },
        {
          text: 'status',
          val: result.status,
        },
      ]
      result = {
        ...result,
        release_date: result.first_air_date,
        title: result.name,
        details,
        type,
      }
    }
    // Append children
    if (targetDiv) {
      const detailsTop = createDetailsTop(result)
      const detailsBottom = createDetailsBottom(result)
      div.appendChild(detailsTop)
      div.appendChild(detailsBottom)
      targetDiv.appendChild(div)
      targetDiv.appendChild(setBackgroundImage(result.backdrop_path))
    }
  }
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
function createDetailsTop({
  poster_path,
  title,
  vote_average,
  release_date,
  overview,
  homepage,
  genres,
  type,
}) {
  const imgSrc = poster_path
    ? `${global.imageUrl}w500${poster_path}`
    : '/images/no-image.jpg'
  const dateString = `${
    type === 'movie' ? 'Release' : 'First Air'
  } Date: ${new Date(release_date).toLocaleDateString()}`
  const genresString = genres.map((g) => `<li>${g.name}</li>`).join('')
  const hompageText = `Visit ${type === 'movie' ? 'Movie' : 'Show'} Homepage`
  vote_average = vote_average.toFixed(1)
  // Create a new div
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
      <p><i class="fas fa-star text-secondary"></i> ${vote_average} / 10</p>
      <p class="text-muted">${dateString}</p>
      <p>${overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${genresString}
      </ul>
      <a href="${homepage}" target="_blank" class="btn">${hompageText}</a>
    </div>
  `
  return div
}

// Create Details Bottom
function createDetailsBottom({ type, production_countries, details }) {
  const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })
  const heading = `${type === 'movie' ? 'Movie' : 'Show'} Info`
  const div = document.createElement('div')
  div.classList.add('details-bottom')
  div.innerHTML = `
      <h2>${heading}</h2>
      <ul>
          ${details
            .map((item) => {
              let { text, val } = item
              if (text === 'budget' || text === 'revenue') {
                val = currencyFormat.format(val)
              }
              if (text === 'runtime') {
                val = `${val} minutes`
              }
              return `<li><span class="text-secondary">${text.toUpperCase()}: </span>${val}</li>`
            })
            .join('')}
        </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${production_countries
        .map((c) => c.name)
        .join(', ')}</div>
  `
  return div
}

// Display backdrop on details page
function setBackgroundImage(imagePath) {
  const div = document.createElement('div')
  // div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
  div.style.backgroundImage = `url(${global.imageUrl}original${imagePath})`
  div.style.backgroundRepeat = 'no-repeat'
  div.style.backgroundPosition = 'center'
  div.style.backgroundSize = 'cover'
  div.style.width = '100vw'
  div.style.height = '100vh'
  div.style.position = 'absolute'
  div.style.top = '0'
  div.style.left = '0'
  div.style.zIndex = '-1'
  div.style.opacity = '0.1'
  return div
}

// Add DOMContentLoaded event listener to document
document.addEventListener('DOMContentLoaded', init)
