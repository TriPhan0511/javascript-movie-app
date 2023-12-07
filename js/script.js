const global = {
  currentPage: window.location.pathname,
}

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

// Sample image's src:
// http://image.tmdb.org/t/p/original/xgGGinKRL8xeRkaAR9RMbtyk60y.jpg
// http://image.tmdb.org/t/p/w500/xgGGinKRL8xeRkaAR9RMbtyk60y.jpg

// Get Popular Movies
function fetchPopularMovies(pageNum) {
  const API_KEY = '72597d8d62e1a0cc5f6e35a022fa82ea'
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MjU5N2Q4ZDYyZTFhMGNjNWY2ZTM1YTAyMmZhODJlYSIsInN1YiI6IjY1NmVkZTQ2M2RjMzEzMDEzODdiODg3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bYXf2MZWGaukA6wTTYO2pECV-zXZs2Clk_wQ8jSN0zs',
    },
  }

  fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNum}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const results = response.results
      const movies = document.querySelector('#popular-movies')
      if (movies) {
        results.forEach((item) => {
          const title = item.title
          const imageSrc = `https://image.tmdb.org/t/p/original/${item.poster_path}`
          const releaseDate = new Date(item.release_date).toLocaleDateString()
          const movieId = item.id
          movies.appendChild(
            createMovieCard(movieId, imageSrc, title, releaseDate)
          )
        })
      }
    })
    .catch((err) => console.error(err))
}

function createMovieCard(movieId, imageSrc, title, releaseDate) {
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
      console.log('Home')
      fetchPopularMovies(1)
      break
    case '/shows.html':
      console.log('Shows')
      break
    case '/movie-details.html':
      console.log('Movie Details')
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
