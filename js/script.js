console.log('Hello')

const API_KEY = '72597d8d62e1a0cc5f6e35a022fa82ea'

const global = {
  currentPage: window.location.pathname,
  urlParams: new URLSearchParams(window.location.search),
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

// ---------- search.html?type=movie&search-term=freelance ----------
function onSubmit(e) {
  const input = e.target.querySelector('input#search-term')
  if (!input || input.value.trim() === '') {
    alert('Please enter search term!')
    input.value = ''
    input.focus()
    e.preventDefault()
  }
}

async function search() {
  const type = global.urlParams.get('type')
  const searchTerm = global.urlParams.get('search-term')
  let isMovie
  let textMovieOrTv
  const rdMovie = document.querySelector('#movie')
  const rdShow = document.querySelector('#tv')

  // Check type
  if (type === 'movie') {
    isMovie = true
    rdMovie.checked = true
    textMovieOrTv = 'movie'
  } else if (type === 'tv') {
    isMovie = false
    rdShow.checked = true
    textMovieOrTv = 'tv'
  } else {
    return
  }

  // Check search-term
  if (!searchTerm || searchTerm.trim() === '') {
    return
  }

  try {
    let response = await fetch(
      `https://api.themoviedb.org/3/search/${textMovieOrTv}?api_key=${API_KEY}&query=${searchTerm}`
    )
    if (!response.ok) {
      throw new Error('Request Failed!')
    }
    response = await response.json()
    isMovie
      ? createMoviesOrShows(
          isMovie,
          response.results,
          document.querySelector('#search-results')
        )
      : createMoviesOrShows(
          isMovie,
          response.results.map((item) => ({
            ...item,
            title: item.name,
            release_date: item.first_air_date,
          })),
          document.querySelector('#search-results')
        )
  } catch (error) {
    console.error(error)
  }
}

// ---------- tv-details.html ----------
async function fetchShowDetails() {
  const id = global.urlParams.has('id') ? global.urlParams.get('id') : ''
  try {
    let response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
    )
    if (!response.ok) {
      throw new Error('Request Failed.')
    }
    response = await response.json()
    response = {
      ...response,
      isMovie: false,
      title: response.name,
      last_episode_to_air: response.last_episode_to_air.name,
    }
    document
      .querySelector('section.container')
      ?.appendChild(createDetails(response))
  } catch (error) {
    console.log(error)
    document
      .querySelector('section.container')
      ?.appendChild(createErrorAlert(error))
  }
}

// ---------- shows.html ----------
async function fetchPopularShows(pageNum) {
  const endpoint = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${pageNum}`
  try {
    let response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error('Request Failed.')
    }
    response = await response.json()
    const shows = response.results.map((item) => ({
      ...item,
      title: item.name,
      release_date: item.first_air_date,
    }))
    createMoviesOrShows(false, shows, document.querySelector('#popular-shows'))
  } catch (error) {
    document
      .querySelector('#popular-shows')
      ?.appendChild(createErrorAlert(error))
  }
}

// ---------- movie-details.html?id= ----------
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
      ?.appendChild(createDetails({ ...response, isMovie: true }))
  } catch (error) {
    document
      .querySelector('section.container')
      ?.appendChild(createErrorAlert(error))
  }
}

// Create movie details
function createDetails({
  isMovie,
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
  backdrop_path,
  number_of_episodes,
  last_episode_to_air,
}) {
  const textMovieOrShow = isMovie ? 'Movie' : 'Show'

  const details = document.createElement('div')
  details.setAttribute('id', 'movie-details')
  details.setAttribute(
    'style',
    `background: url(https://image.tmdb.org/t/p/original/${backdrop_path}) no-repeat center
  center/cover;`
  )

  // detailsTop
  const detailsTop = document.createElement('div')
  detailsTop.className = 'details-top'
  detailsTop.appendChild(createImageDiv(poster_path, title))
  detailsTop.appendChild(
    createIntro(
      title,
      vote_average,
      release_date,
      overview,
      genres,
      homepage,
      textMovieOrShow
    )
  )
  details.appendChild(detailsTop)

  // detailsBottom
  const detailsBottom = document.createElement('div')
  detailsBottom.className = 'details-bottom'
  // Heading
  const h2 = document.createElement('h2')
  h2.appendChild(document.createTextNode(`${textMovieOrShow} Info`))
  detailsBottom.appendChild(h2)
  // Info division
  const infoList = isMovie
    ? createMovieInfo(budget, revenue, runtime, status)
    : createShowInfo(number_of_episodes, last_episode_to_air, status)
  detailsBottom.appendChild(infoList)
  // Productions Companies
  const h4 = document.createElement('h4')
  h4.appendChild(document.createTextNode('Production Companies'))
  detailsBottom.appendChild(h4)
  const companies = document.createElement('div')
  companies.className = 'list-group'
  companies.appendChild(
    document.createTextNode(production_companies.map((c) => c.name).join(', '))
  )
  detailsBottom.appendChild(companies)

  details.appendChild(detailsBottom)

  return details

  function createShowInfo(number_of_episodes, last_episode_to_air, status) {
    const infoList = document.createElement('ul')
    const infoArr = [
      { k: 'Number Of Episodes: ', v: number_of_episodes },
      { k: 'Last Episode To Air', v: last_episode_to_air },
      { k: 'Status', v: status },
    ]
    infoArr.forEach(({ k, v }) => {
      const li = document.createElement('li')
      const span = document.createElement('span')
      span.className = 'text-secondary'
      span.appendChild(document.createTextNode(`${k}: `))
      li.appendChild(span)
      li.appendChild(document.createTextNode(v))
      infoList.appendChild(li)
    })

    return infoList
  }

  function createMovieInfo(budget, revenue, runtime, status) {
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

    return infoList
  }

  function createIntro(
    title,
    vote_average,
    release_date,
    overview,
    genres,
    homepage,
    textMovieOrShow
  ) {
    const intro = document.createElement('div')

    const h2 = document.createElement('h2')
    h2.appendChild(document.createTextNode(title))
    intro.appendChild(h2)

    const votePara = document.createElement('p')
    const icon = document.createElement('i')
    icon.className = 'fas fa-star text-primary'
    votePara.appendChild(icon)
    votePara.appendChild(
      document.createTextNode(` ${parseFloat(vote_average).toFixed(1)} / 10`)
    )
    intro.appendChild(votePara)

    const releaseDatePara = document.createElement('p')
    releaseDatePara.className = 'text-muted'
    releaseDatePara.appendChild(
      document.createTextNode(
        `Release Date: ${new Date(release_date).toLocaleDateString()}`
      )
    )
    intro.appendChild(releaseDatePara)

    const overviewPara = document.createElement('p')
    overviewPara.appendChild(document.createTextNode(overview))
    intro.appendChild(overviewPara)

    const h5 = document.createElement('h5')
    h5.appendChild(document.createTextNode('Genres'))
    intro.appendChild(h5)

    const ul = document.createElement('ul')
    ul.className = 'list-group'
    genres
      .map((genre) => genre.name)
      .forEach((name) => {
        const li = document.createElement('li')
        li.appendChild(document.createTextNode(name))
        ul.appendChild(li)
      })
    intro.appendChild(ul)

    const link = document.createElement('a')
    link.className = 'btn'
    link.setAttribute('href', homepage)
    link.setAttribute('target', '_blank')
    link.appendChild(
      document.createTextNode(`Visit ${textMovieOrShow} Homepage`)
    )
    intro.appendChild(link)
    return intro
  }

  function createImageDiv(poster_path, title) {
    const imageDiv = document.createElement('div')
    const img = document.createElement('img')
    img.className = 'card-img-top'
    let imageSrc = `https://image.tmdb.org/t/p/original/${poster_path}`
    imageSrc = imageSrc.includes('null') ? 'images/no-image.jpg' : imageSrc
    img.setAttribute('src', imageSrc)
    img.setAttribute('alt', title)
    imageDiv.appendChild(img)
    return imageDiv
  }
}

// ---------- index.html ----------
// Get Popular Movies
async function fetchPopularMovies(pageNum) {
  const endpoint = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNum}`
  try {
    let response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error('Request Failed.')
    }
    response = await response.json()
    createMoviesOrShows(
      true,
      response.results,
      document.querySelector('#popular-movies')
    )
  } catch (error) {
    document
      .querySelector('#popular-movies')
      ?.appendChild(createErrorAlert(error))
  }
}

// Create a list of movies
function createMoviesOrShows(isMovie, arr, ele) {
  if (ele) {
    arr.forEach(({ id, title, poster_path, release_date }) => {
      let imageSrc = `https://image.tmdb.org/t/p/original/${poster_path}`
      imageSrc = imageSrc.includes('null') ? 'images/no-image.jpg' : imageSrc
      ele.appendChild(
        createCard(
          isMovie,
          id,
          imageSrc,
          title,
          new Date(release_date).toLocaleDateString()
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
  return alert
}

// Create a movie card
function createCard(isMovie, id, imageSrc, title, releaseDate) {
  const card = document.createElement('div')
  card.className = 'card'

  const link = document.createElement('a')
  const page = isMovie ? 'movie-details' : 'tv-details'
  link.setAttribute('href', `${page}.html?id=${id}`)
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
      fetchPopularShows(1)
      break
    case '/movie-details.html':
      console.log('Movie Details')
      fetchMovieDetails()
      break
    case '/tv-details.html':
      console.log('Show Details')
      fetchShowDetails()
      break
    case '/search.html':
      console.log('Search')
      search()
      break
  }

  highlightActiveLink('nav-link')
  document
    .querySelector('form.search-form')
    ?.addEventListener('submit', onSubmit)
}

document.addEventListener('DOMContentLoaded', init)
