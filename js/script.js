const API_KEY = '72597d8d62e1a0cc5f6e35a022fa82ea'

const global = {
  currentPage: window.location.pathname,
  urlParams: new URLSearchParams(window.location.search),
}

async function fetchMovieDetails() {
  const id = global.urlParams.has('id') ? global.urlParams.get('id') : ''
  try {
    let response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    )
    if (!response.ok) {
      throw new Error('Request Failed.')
    }
    response = await response.json()
    console.log(response)
    const title = response.title
    const voteAverage = response.vote_average
    const releaseDate = new Date(response.release_date).toLocaleDateString()
    const overview = response.overview
    const genres = response.genres
    const homepage = response.homepage
    const budget = response.budget
    const revenue = response.revenue
    const runtime = response.runtime
    const status = response.status
    const productionCompanies = response.production_companies.map((c) => c.name)

    console.log(title)
    console.log(voteAverage)
    console.log(releaseDate)
    console.log(overview)
    console.log(genres)
    console.log(homepage)
    console.log(budget)
    console.log(revenue)
    console.log(runtime)
    console.log(status)
    console.log(productionCompanies)
  } catch (error) {
    console.error(error)
  }
}
// function fetchMovieDetails() {
//   const id = global.urlParams.has('id') ? global.urlParams.get('id') : ''
//   fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Request Failed.')
//       }
//       return response.json()
//     })
//     .then((response) => {
//       console.log(response)
//       const title = response.title
//       const voteAverage = response.vote_average
//       const releaseDate = new Date(response.release_date).toLocaleDateString()
//       const overview = response.overview
//       const genres = response.genres
//       const homepage = response.homepage
//       const budget = response.budget
//       const revenue = response.revenue
//       const runtime = response.runtime
//       const status = response.status
//       const productionCompanies = response.production_companies.map(
//         (c) => c.name
//       )

//       console.log(title)
//       console.log(voteAverage)
//       console.log(releaseDate)
//       console.log(overview)
//       console.log(genres)
//       console.log(homepage)
//       console.log(budget)
//       console.log(revenue)
//       console.log(runtime)
//       console.log(status)
//       console.log(productionCompanies)
//     })
//     .catch((err) => console.error(err))
// }

// TEST
// function getQueryStrings() {
//   if (global.urlParams.has('id')) {
//     console.log(global.urlParams.get('id'))
//     console.log(typeof global.urlParams.get('id'))
//   } else {
//     console.log('no id')
//   }
// }
// getQueryStrings()

// Highlight active link
function highlightActiveLink(className) {
  const currentActiveLink =
    global.currentPage === '/index.html'
      ? document.querySelector(`.${className}`)
      : Array.from(document.querySelectorAll(`.${className}`))?.filter(
          (link) => link.getAttribute('href') === global.currentPage
        )[0]
  currentActiveLink?.classList?.toggle('active')
}

// Get Popular Movies
async function fetchPopularMovies(pageNum) {
  const endpoint = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNum}`
  try {
    let response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error('Request Failed.')
    }
    response = await response.json()
    createMovies(response.results)
  } catch (error) {
    createErrorAlert(error)
  }
}

// Create a list of movies
function createMovies(movies) {
  const list = document.querySelector('#popular-movies')
  if (list) {
    movies.forEach((movie) => {
      list.appendChild(
        createMovie(
          movie.id,
          `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
          movie.title,
          new Date(movie.release_date).toLocaleDateString()
        )
      )
    })
  }
}

// Create an error alert
function createErrorAlert(error) {
  const alert = document.createElement('p')
  alert.className = 'alert'
  alert.style.textAlign = 'center'
  alert.appendChild(document.createTextNode(error))
  document.querySelector('#popular-movies')?.appendChild(alert)
}

// Create a movie card
function createMovie(movieId, imageSrc, title, releaseDate) {
  const card = document.createElement('div')
  card.className = 'card'

  const link = document.createElement('a')
  link.setAttribute('href', `movie-details.html?id=${movieId}`)
  const img = document.createElement('img')
  img.className = 'card-img-top'
  img.setAttribute('src', imageSrc)
  img.setAttribute('alt', 'Movie Title')
  link.appendChild(img)
  card.appendChild(link)

  const cardBody = document.createElement('div')
  cardBody.className = 'card-body'
  const cardTitle = document.createElement('h5')
  cardTitle.className = 'card-title'
  cardTitle.appendChild(document.createTextNode(title))
  cardBody.appendChild(cardTitle)
  const cardText = document.createElement('p')
  cardText.className = 'card-text'
  const text = document.createElement('small')
  text.className = 'text-muted'
  text.appendChild(document.createTextNode(`Release: ${releaseDate}`))
  cardText.appendChild(text)
  cardBody.appendChild(cardText)
  card.appendChild(cardBody)

  return card
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      // console.log('Home')
      fetchPopularMovies(1)
      break
    case '/shows.html':
      console.log('Shows')
      break
    case '/movie-details.html':
      // console.log('Movie Details')
      fetchMovieDetails()
      break
    case '/tv-details.html':
      console.log('Show Details')
      break
    case '/search.html':
      console.log('Search')
      break
  }

  highlightActiveLink('nav-link')
}

document.addEventListener('DOMContentLoaded', init)
