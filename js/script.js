const global = {
  currentPage: window.location.pathname,
}

const activate = (num) => {
  //   document.querySelector(`.nav-link:nth-child(${num})`)?.classList.add('active')
  console.log(document.querySelectorAll('.nav-link'))[1]
  document.querySelector(`.nav-link`)?.classList.add('active')
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home')
      activate(1)
      break
    case '/shows.html':
      console.log('Shows')
      activate(2)
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
}

document.addEventListener('DOMContentLoaded', init)
