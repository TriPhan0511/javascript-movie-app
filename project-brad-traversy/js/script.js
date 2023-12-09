const global = {
  currentPage: window.location.pathname,
}

async function displayPopularMovies() {
  const results = await fetchAPIData('movie/popular')
  console.log(results)
}

// Fetch data from the https://developer.themoviedb.org/docs API
async function fetchAPIData(endpoint) {
  const API_KEY = '72597d8d62e1a0cc5f6e35a022fa82ea'
  const API_URL = 'https://api.themoviedb.org/3/'
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  )
  const data = await response.json()
  return data
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
