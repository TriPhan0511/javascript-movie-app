// Global states
const global = {
  api: {
    apiUrl: 'https://api.themoviedb.org/3/',
    apiKey: '72597d8d62e1a0cc5f6e35a022fa82ea',
    imageUrl: 'https://image.tmdb.org/t/p/',
  },
  search: {
    type: new URLSearchParams(window.location.search).get('type'),
    searchTerm: new URLSearchParams(window.location.search).get('search-term'),
    page: 1,
  },
  // extraInfo: {
  //   themoviedborg: {
  //     userName: 'triphan',
  //     pw: 'City+newcode',
  //   },
  //   nelifyLink: 'https://javascript-flixx-app.netlify.app/',
  // },
}

// Initialize app
function init() {
  switch (window.location.pathname) {
    case '/':
    case '/index.html':
      displaySlider()
      displayPopularItems(
        'movie/popular',
        'movie',
        document.querySelector('#popular-movies')
      )
      validateSearchForm()
      break
    case '/shows.html':
      displayPopularItems(
        'tv/popular',
        'show',
        document.querySelector('#popular-shows')
      )
      break
    case '/movie-details.html':
      displayDetails('movie')
      break
    case '/tv-details.html':
      displayDetails('show')
      break
    case '/search.html':
      displaySearchResults()
      break
  }
  activeLink()
  addEventListenersForButtons()
}

// Add DOMContentLoaded event listener to document
document.addEventListener('DOMContentLoaded', init)

// Fetch data from https://themoviedb.org
async function fetchData(endpoint = 'movie/popular') {
  showSpinner()
  let response = await fetch(
    `${global.api.apiUrl}${endpoint}?api_key=${global.api.apiKey}&language=en-US`
  )
  response = await response.json()
  hideSpinner()
  return response
}

// Search and fetch data from https://themoviedb.org
async function search(endpoint, searchTerm, page = 1) {
  showSpinner()
  let response = await fetch(
    `${global.api.apiUrl}${endpoint}?api_key=${global.api.apiKey}&language=en-US&query=${searchTerm}&page=${page}`
  )
  response = await response.json()
  hideSpinner()
  return response
}

// Display popular movies/shows
async function displayPopularItems(endpoint, type, targetEle) {
  const { results } = await fetchData(endpoint)
  displayResults({
    results,
    type,
    targetEle,
  })
}

// Display movie/show details
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

// Display search results (movies/shows)
async function displaySearchResults() {
  // Validate
  if (!global.search.type) {
    return
  }
  if (!global.search.searchTerm) {
    showAlert(
      document.querySelector('#alert'),
      'You should eneter a search term.'
    )
    return
  }
  // Search and fetch data from API
  const { results, page, total_pages } = await search(
    `search/${global.search.type}`,
    global.search.searchTerm,
    global.search.page
  )
  // Display results
  displayResults({
    results,
    type: global.search.type,
    targetEle: document.querySelector('#search-results'),
  })
  // Set global.search.page
  global.search.page = page
  // Set the "checked" attribute for radio buttons
  document
    .querySelector(`input#${global.search.type}`)
    ?.setAttribute('checked', true)
  // Set heading
  const heading = document.querySelector('#search-results-heading')
  if (heading) {
    const h2 = document.createElement('h2')
    h2.appendChild(
      document.createTextNode(`Results for ${global.search.searchTerm}`)
    )
    heading.innerHTML = ''
    heading.appendChild(h2)
  }
  // Set pagination text
  const pageCounter = document.querySelector('.page-counter')
  if (pageCounter) {
    pageCounter.innerHTML = ''
    pageCounter.appendChild(
      document.createTextNode(`Page ${page} of ${total_pages}`)
    )
  }
  // Set disabled attribute for prev and next buttons
  const prevButton = document.querySelector('button#prev')
  const nextButton = document.querySelector('button#next')
  if (prevButton && nextButton) {
    if (page === 1) {
      prevButton.disabled = true
    } else {
      prevButton.disabled = false
    }
    if (page === total_pages) {
      nextButton.disabled = true
    } else {
      nextButton.disabled = false
    }
  }
}

// Display results (movies/shows)
function displayResults({ results, type, targetEle }) {
  if (targetEle) {
    results.forEach((item) => {
      const { id, poster_path } = item
      let title, release_date, dateString, linkText
      if (type === 'movie') {
        title = item.title
        release_date = item.release_date
        dateString = 'Release Date'
        linkText = 'movie'
      } else {
        title = item.name
        release_date = item.first_air_date
        dateString = 'First Air Date'
        linkText = 'tv'
      }

      const link = `${linkText}-details.html?id=${id}`
      const imgSrc = poster_path
        ? `${global.api.imageUrl}w500${poster_path}`
        : '/images/no-image.jpg'
      const releaseDateString = `${dateString}: ${new Date(
        release_date
      ).toLocaleDateString()}`
      const card = createCard(link, title, imgSrc, releaseDateString)
      targetEle.appendChild(card)
    })
  }
}

// Add event listener for prev and next buttons
function addEventListenersForButtons() {
  document.querySelector('button#next')?.addEventListener('click', () => {
    global.search.page++
    document.querySelector('#search-results').innerHTML = ''
    displaySearchResults()
  })
  document.querySelector('button#prev')?.addEventListener('click', () => {
    global.search.page--
    document.querySelector('#search-results').innerHTML = ''
    displaySearchResults()
  })
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

// Spinner
function showSpinner() {
  document.querySelector('.spinner')?.classList?.add('show')
}

function hideSpinner() {
  document.querySelector('.spinner')?.classList?.remove('show')
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
    ? `${global.api.imageUrl}w500${poster_path}`
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
  div.style.backgroundImage = `url(${global.api.imageUrl}original${imagePath})`
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

// Display Slider Movies
async function displaySlider() {
  const { results } = await fetchData('movie/now_playing')
  results.forEach(({ id, title, poster_path, vote_average }) => {
    const imgSrc = poster_path
      ? `${global.api.imageUrl}w500${poster_path}`
      : './images/no-image.jpg'
    vote_average = vote_average.toFixed(1)
    const div = document.createElement('div')
    div.classList.add('swiper-slide')
    div.innerHTML = `
    <a href='movie-details.html?id=${id}'>
      <img src='${imgSrc}' alt='${title}' />
    </a>
    <h4 class='swiper-rating'>
      <i class='fas fa-star text-secondary'></i> ${vote_average} / 10
    </h4>
  `
    document.querySelector('.swiper-wrapper')?.appendChild(div)
    initSwiper()
  })
}

// Init Swiper
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  })
}

// Validate search from
function validateSearchForm() {
  document.querySelector('.search-form')?.addEventListener('submit', (e) => {
    const input = document.querySelector('#search-term')
    if (input) {
      if (input.value.trim() === '') {
        const alertEle = document.querySelector('#alert')
        showAlert(alertEle, 'You should enter search term.', 'alert error')
        input.value = ''
        input.focus()
        e.preventDefault()
      }
    }
  })
}

// Show alert
function showAlert(alertEle, msg, classes = 'alert error') {
  if (alertEle) {
    const div = document.createElement('div')
    div.className = classes
    div.appendChild(document.createTextNode(msg))
    alertEle.innerHTML = ''
    alertEle.appendChild(div)
    setTimeout(() => {
      div.remove()
    }, 2000)
  }
}
