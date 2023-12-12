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
      // console.log('Movie Details')
      displayMovieDetails()
      break
    case '/tv-details.html':
      console.log('Show Details')
      displayShowDetails()
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
async function displayMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  if (id) {
    const {
      backdrop_path,
      poster_path,
      title,
      vote_average,
      release_date,
      overview,
      homepage,
      genres,
      // budget,
      // revenue,
      // runtime,
      // status,
      // production_countries,
      ...rest
    } = await fetchData(`movie/${id}`)
    const { budget, revenue, runtime, status, production_countries } = rest
    console.log(rest)
    const currencyFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    })
    const imgSrc = poster_path
      ? `${global.imageUrl}w500${poster_path}`
      : '/images/no-image.jpg'
    const releaseDateString = `Release Date: ${new Date(
      release_date
    ).toLocaleDateString()}`
    const div = document.createElement('div')
    // Details Top
    div.appendChild(
      createDetailsTop(
        imgSrc,
        title,
        vote_average.toFixed(1),
        releaseDateString,
        overview,
        homepage,
        genres,
        'movie'
      )
    )
    // Details Bottom
    div.appendChild(
      createMovieDetailsBottom(
        currencyFormat.format(budget),
        currencyFormat.format(revenue),
        `${runtime} minutes`,
        status,
        production_countries.map((c) => c.name)
      )
    )
    // Append children
    const targetDiv = document.querySelector('#movie-details')
    if (targetDiv) {
      targetDiv.appendChild(setBackgroundImage(backdrop_path))
      targetDiv.appendChild(div)
    }
  }
}
// async function displayMovieDetails() {
//   const urlParams = new URLSearchParams(window.location.search)
//   const id = urlParams.get('id')
//   if (id) {
//     const {
//       poster_path,
//       title,
//       vote_average,
//       release_date,
//       overview,
//       homepage,
//       genres,
//       backdrop_path,
//       budget,
//       revenue,
//       runtime,
//       status,
//       production_countries,
//     } = await fetchData(`movie/${id}`)
//     const currencyFormat = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0,
//     })
//     const imgSrc = poster_path
//       ? `${global.imageUrl}w500${poster_path}`
//       : '/images/no-image.jpg'
//     const releaseDateString = `Release Date: ${new Date(
//       release_date
//     ).toLocaleDateString()}`
//     const div = document.createElement('div')
//     // Details Top
//     div.appendChild(
//       createDetailsTop(
//         imgSrc,
//         title,
//         vote_average.toFixed(1),
//         releaseDateString,
//         overview,
//         homepage,
//         genres,
//         'movie'
//       )
//     )
//     // Details Bottom
//     div.appendChild(
//       createMovieDetailsBottom(
//         currencyFormat.format(budget),
//         currencyFormat.format(revenue),
//         `${runtime} minutes`,
//         status,
//         production_countries.map((c) => c.name)
//       )
//     )
//     // Append children
//     const targetDiv = document.querySelector('#movie-details')
//     if (targetDiv) {
//       targetDiv.appendChild(setBackgroundImage(backdrop_path))
//       targetDiv.appendChild(div)
//     }
//   }
// }
// Display show details
async function displayShowDetails() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  if (id) {
    const {
      poster_path,
      name,
      vote_average,
      last_air_date,
      overview,
      homepage,
      genres,
      backdrop_path,
      production_countries,
      status,
      number_of_episodes,
      last_episode_to_air,
    } = await fetchData(`tv/${id}`)

    const imgSrc = poster_path
      ? `${global.imageUrl}w500${poster_path}`
      : '/images/no-image.jpg'
    const releaseDateString = `Last Air Date: ${new Date(
      last_air_date
    ).toLocaleDateString()}`
    const div = document.createElement('div')
    // Details Top
    div.appendChild(
      createDetailsTop(
        imgSrc,
        name,
        vote_average.toFixed(1),
        releaseDateString,
        overview,
        homepage,
        genres,
        'show'
      )
    )
    // Details Bottom
    div.appendChild(
      createShowDetailsBottom(
        number_of_episodes,
        last_air_date,
        status,
        production_countries.map((c) => c.name)
      )
    )
    // Append children
    const targetDiv = document.querySelector('#show-details')
    if (targetDiv) {
      targetDiv.appendChild(setBackgroundImage(backdrop_path))
      targetDiv.appendChild(div)
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
function createDetailsTop(
  imgSrc,
  title,
  voteAverage,
  releaseDateString,
  overview,
  homePageLink,
  genres = [],
  type = 'movie'
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
      ${genres.map((g) => `<li>${g.name}</li>`).join('')}
      </ul>
      <a href="${homePageLink}" target="_blank" class="btn">Visit ${
    type === 'movie' ? 'Movie' : 'Show'
  } Homepage</a>
    </div>
  `
  return div
}

// Create movie details bottom
function createMovieDetailsBottom(
  budget,
  revenue,
  runtime,
  status,
  productionCompanies
) {
  const div = document.createElement('div')
  div.classList.add('details-bottom')
  div.innerHTML = `
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> ${budget}</li>
        <li><span class="text-secondary">Revenue:</span> ${revenue}</li>
        <li><span class="text-secondary">Runtime:</span> ${runtime}</li>
        <li><span class="text-secondary">Status:</span> ${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${productionCompanies.join(', ')}</div>
  `
  return div
}

// Create tv show details bottom
function createShowDetailsBottom(
  numberOfEpisodes,
  lastEpisode,
  status,
  productionCompanies
) {
  const div = document.createElement('div')
  div.classList.add('details-bottom')
  div.innerHTML = `
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number Of Episodes:</span> ${numberOfEpisodes}</li>
        <li><span class="text-secondary">Last Episode To Air:</span> ${lastEpisode}</li>
        <li><span class="text-secondary">Status:</span> ${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${productionCompanies.join(', ')}</div>
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
