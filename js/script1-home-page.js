const API_KEY = '72597d8d62e1a0cc5f6e35a022fa82ea'

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
