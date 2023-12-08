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
    document
      .querySelector('section.container')
      ?.appendChild(createMovieDetails(response))
  } catch (error) {
    console.error(error)
  }
}

// Create movie details
function createMovieDetails({
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
}) {
  const movieDetails = document.createElement('div')
  movieDetails.setAttribute('id', 'movie-details')

  const detailsTop = document.createElement('div')
  detailsTop.className = 'details-top'

  const imageDiv = document.createElement('div')
  const img = document.createElement('img')
  img.className = 'card-img-top'
  img.setAttribute('src', `https://image.tmdb.org/t/p/original/${poster_path}`)
  img.setAttribute('alt', title)
  imageDiv.appendChild(img)
  detailsTop.appendChild(imageDiv)

  const div = document.createElement('div')
  const h2 = document.createElement('h2')
  h2.appendChild(document.createTextNode(title))
  div.appendChild(h2)

  const votePara = document.createElement('p')
  const icon = document.createElement('i')
  icon.className = 'fas fa-star text-primary'
  votePara.appendChild(icon)
  votePara.appendChild(
    document.createTextNode(` ${parseFloat(vote_average).toFixed(1)} / 10`)
  )
  div.appendChild(votePara)

  const releaseDatePara = document.createElement('p')
  releaseDatePara.className = 'text-muted'
  releaseDatePara.appendChild(
    document.createTextNode(
      `Release Date: ${new Date(release_date).toLocaleDateString()}`
    )
  )
  div.appendChild(releaseDatePara)

  const overviewPara = document.createElement('p')
  overviewPara.appendChild(document.createTextNode(overview))
  div.appendChild(overviewPara)

  const h5 = document.createElement('h5')
  h5.appendChild(document.createTextNode('Genres'))
  div.appendChild(h5)

  const ul = document.createElement('ul')
  ul.className = 'list-group'
  genres
    .map((genre) => genre.name)
    .forEach((name) => {
      const li = document.createElement('li')
      li.appendChild(document.createTextNode(name))
      ul.appendChild(li)
    })
  div.appendChild(ul)

  const link = document.createElement('a')
  link.className = 'btn'
  link.setAttribute('href', homepage)
  link.setAttribute('target', '_blank')
  link.appendChild(document.createTextNode('Visit Movie Homepage'))
  div.appendChild(link)
  detailsTop.appendChild(div)

  movieDetails.appendChild(detailsTop)

  const detailsBottom = document.createElement('div')
  detailsBottom.className = 'details-bottom'

  const heading2 = document.createElement('h2')
  heading2.appendChild(document.createTextNode('Movie Info'))
  detailsBottom.appendChild(heading2)

  const infoList = document.createElement('ul')
  const infoArr = [
    { k: 'Budget', v: budget },
    { k: 'Revenue', v: revenue },
    { k: 'Runtime', v: runtime },
    { k: 'Status', v: status },
  ]
  infoArr.forEach(({ k, v }) => {
    const li = document.createElement('li')
    const span = document.createElement('span')
    span.className = 'text-secondary'
    span.appendChild(document.createTextNode(`${k}: `))
    li.appendChild(span)
    let liText = ''
    switch (k.toLowerCase()) {
      case 'status':
        liText = v
        break
      case 'runtime':
        liText = `${v} minutes`
        break
      default:
        liText = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(v)
        break
    }

    li.appendChild(document.createTextNode(liText))
    infoList.appendChild(li)
  })
  detailsBottom.appendChild(infoList)

  const h4 = document.createElement('h4')
  h4.appendChild(document.createTextNode('Production Companies'))
  detailsBottom.appendChild(h4)

  const companies = document.createElement('div')
  companies.className = 'list-group'
  companies.appendChild(
    document.createTextNode(production_companies.map((c) => c.name).join(', '))
  )
  detailsBottom.appendChild(companies)

  movieDetails.appendChild(detailsBottom)

  return movieDetails
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
