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

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home')
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
