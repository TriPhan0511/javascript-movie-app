const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: '72597d8d62e1a0cc5f6e35a022fa82ea',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
}

// Display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular')
  results.forEach(({ id, poster_path, title, release_date }) => {
    const imgSrc = poster_path
      ? `https://image.tmdb.org/t/p/w500/${poster_path}`
      : 'images/no-image.jpg'
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="movie-details.html?id=${id}">
      <img
        src="${imgSrc}"
        class="card-img-top"
        alt="${title}"
      />
      </a>
      <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${new Date(
          release_date
        ).toLocaleDateString()}</small>
      </p>
      </div>
      `
    document.querySelector('#popular-movies')?.appendChild(div)
  })
}

// Display 20 most popular tv shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular')
  results.forEach(({ id, poster_path, name, first_air_date }) => {
    const imgSrc = poster_path
      ? `https://image.tmdb.org/t/p/w500/${poster_path}`
      : 'images/no-image.jpg'
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="tv-details.html?id=${id}">
      <img
        src="${imgSrc}"
        class="card-img-top"
        alt="${name}"
      />
      </a>
      <div class="card-body">
      <h5 class="card-title">${name}</h5>
      <p class="card-text">
        <small class="text-muted">Air Date: ${new Date(
          first_air_date
        ).toLocaleDateString()}</small>
      </p>
      </div>
      `
    document.querySelector('#popular-shows')?.appendChild(div)
  })
}

// Display Movie Details
async function displayMovieDetails() {
  // const movieId = window.location.search.split('=')[1]
  const movieId = new URLSearchParams(window.location.search).get('id')
  let {
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
  } = await fetchAPIData(`movie/${movieId}`)
  // Overlay for background image
  displayBackgroundImage('movie', backdrop_path)
  // budget = `$${addCommasToNumber(budget)}`
  // revenue = `$${addCommasToNumber(revenue)}`
  const currencyFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })
  budget = currencyFormat.format(budget)
  revenue = currencyFormat.format(revenue)
  const imgSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500/${poster_path}`
    : '../images/no-image.jpg'
  const div = document.createElement('div')

  div.innerHTML = `
    <div class="details-top">
      <div>
        <img
          src="${imgSrc}"
          class="card-img-top"
          alt="${title}"
        />
      </div>
      <div>
        <h2>${title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${new Date(
          release_date
        ).toLocaleDateString()}</p>
        <p>${overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">
        ${genres.map((g) => `<li>${g.name}</li>`).join('')}
        </ul>
        <a href="${homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> ${budget}</li>
        <li><span class="text-secondary">Revenue:</span> ${revenue}</li>
        <li><span class="text-secondary">Runtime:</span> ${runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${production_companies
        .map((c) => `<span>${c.name}</span>`)
        .join(', ')}</div>
    </div>
  `
  document.querySelector('#movie-details')?.appendChild(div)
}

// Display Show Details
async function displayShowDetails() {
  const showId = new URLSearchParams(window.location.search).get('id')
  let {
    name,
    poster_path,
    vote_average,
    last_air_date,
    overview,
    genres,
    homepage,
    status,
    production_companies,
    backdrop_path,
    number_of_episodes,
    last_episode_to_air,
  } = await fetchAPIData(`tv/${showId}`)
  displayBackgroundImage('tv', backdrop_path) // Overlay for background image
  const imgSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500/${poster_path}`
    : '../images/no-image.jpg'

  const div = document.createElement('div')
  div.innerHTML = `
    <div class="details-top">
      <div>
        <img
          src="${imgSrc}"
          class="card-img-top"
          alt="${name}"
        />
      </div>
      <div>
        <h2>${name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Last Air Date: ${new Date(
          last_air_date
        ).toLocaleDateString()}</p>
        <p>${overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">
        ${genres.map((g) => `<li>${g.name}</li>`).join('')}
        </ul>
        <a href="${homepage}" target="_blank" class="btn">Visit Show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number Of Episodes:</span> ${number_of_episodes}</li>
        <li><span class="text-secondary">Last Episode To Air:</span> ${
          last_episode_to_air.name
        }</li>
        <li><span class="text-secondary">Status:</span> ${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${production_companies
        .map((c) => `<span>${c.name}</span>`)
        .join(', ')}</div>
    </div>
  `
  document.querySelector('#show-details')?.appendChild(div)
}

// Display Backdrop On Details Page
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div')
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
  overlayDiv.style.backgroundSize = 'cover'
  overlayDiv.style.backgroundPosition = 'center'
  overlayDiv.style.backgroundRepeat = 'no-repeat'
  overlayDiv.style.height = '100vh'
  overlayDiv.style.width = '100vw'
  overlayDiv.style.position = 'absolute'
  overlayDiv.style.top = '0'
  overlayDiv.style.left = '0'
  overlayDiv.style.zIndex = '-1'
  overlayDiv.style.opacity = '0.1'

  if (type === 'movie') {
    document.querySelector('#movie-details')?.appendChild(overlayDiv)
  } else {
    document.querySelector('#show-details')?.appendChild(overlayDiv)
  }
}

// Search Movies/Shows
async function search(currentPage = 1) {
  const urlParams = new URLSearchParams(window.location.search)
  global.search.type = urlParams.get('type')
  global.search.term = urlParams.get('search-term')
  if (global.search.term) {
    const { results, total_pages, page, total_results } = await searchAPIData(
      currentPage
    )
    global.search.page = page
    global.search.totalPages = total_pages
    global.search.totalResults = total_results
    if (results.length === 0) {
      showAlert('No results found.')
      return
    }
    displaySearchResults(results)
    // document.querySelector('input#search-term').value = ''
  } else {
    showAlert('Please enter a search term!')
  }
}
// async function search() {
//   const urlParams = new URLSearchParams(window.location.search)
//   global.search.type = urlParams.get('type')
//   global.search.term = urlParams.get('search-term')
//   if (global.search.term) {
//     const { results, total_pages, page, total_results } = await searchAPIData()
//     global.search.page = page
//     global.search.totalPages = total_pages
//     global.search.totalResults = total_results
//     if (results.length === 0) {
//       showAlert('No results found.')
//       return
//     }
//     displaySearchResults(results)
//     // document.querySelector('input#search-term').value = ''
//   } else {
//     showAlert('Please enter a search term!')
//   }
// }

function displaySearchResults(results) {
  const searchResult = document.querySelector('#search-results')
  if (searchResult) {
    searchResult.innerHTML = ''
    results.forEach((res) => {
      const { id, poster_path } = res
      let title, dateString
      if (global.search.type === 'movie') {
        title = res.title
        dateString = `Release Date: ${new Date(
          res.release_date
        ).toLocaleDateString()}`
        const input = document.querySelector('input#movie')
        if (input) {
          input.checked = true
        }
      } else {
        title = res.name
        dateString = `First Air Date: ${new Date(
          res.first_air_date
        ).toLocaleDateString()}`
        const input = document.querySelector('input#tv')
        if (input) {
          input.checked = true
        }
      }
      const imgSrc = poster_path
        ? `https://image.tmdb.org/t/p/w500/${poster_path}`
        : 'images/no-image.jpg'

      const div = document.createElement('div')
      div.classList.add('card')
      div.innerHTML = `
        <a href="${global.search.type}-details.html?id=${id}">
        <img
          src="${imgSrc}"
          class="card-img-top"
          alt="${title}"
        />
        </a>
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">
            <small class="text-muted">${dateString}</small>
          </p>
        </div>
        `
      document.querySelector('#search-results-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
      `
      document.querySelector('#search-results')?.appendChild(div)
    })
    displayPagination()
  }
}
// function displaySearchResults(results) {
//   results.forEach((res) => {
//     const { id, poster_path } = res
//     let title, dateString
//     if (global.search.type === 'movie') {
//       title = res.title
//       dateString = `Release Date: ${new Date(
//         res.release_date
//       ).toLocaleDateString()}`
//       const input = document.querySelector('input#movie')
//       if (input) {
//         input.checked = true
//       }
//     } else {
//       title = res.name
//       dateString = `First Air Date: ${new Date(
//         res.first_air_date
//       ).toLocaleDateString()}`
//       const input = document.querySelector('input#tv')
//       if (input) {
//         input.checked = true
//       }
//     }
//     const imgSrc = poster_path
//       ? `https://image.tmdb.org/t/p/w500/${poster_path}`
//       : 'images/no-image.jpg'

//     const div = document.createElement('div')
//     div.classList.add('card')
//     div.innerHTML = `
//       <a href="${global.search.type}-details.html?id=${id}">
//       <img
//         src="${imgSrc}"
//         class="card-img-top"
//         alt="${title}"
//       />
//       </a>
//       <div class="card-body">
//         <h5 class="card-title">${title}</h5>
//         <p class="card-text">
//           <small class="text-muted">${dateString}</small>
//         </p>
//       </div>
//       `
//     document.querySelector('#search-results-heading').innerHTML = `
//       <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
//     `
//     document.querySelector('#search-results')?.appendChild(div)
//   })
//   displayPagination()
// }

// Create & Display Pagination For Search
function displayPagination() {
  const paginationDiv = document.querySelector('#pagination')
  if (paginationDiv) {
    paginationDiv.innerHTML = ''
    const div = document.createElement('div')
    div.classList.add('pagination')
    div.innerHTML = `
      <button class="btn btn-primary" id="prev">Prev</button>
      <button class="btn btn-primary" id="next">Next</button>
      <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `
    document.querySelector('#pagination')?.appendChild(div)
    // Disable prev button if on first page
    global.search.page === 1 &&
      document.querySelector('button#prev')?.setAttribute('disabled', true)
    // Disable next button if on last page
    global.search.page === global.search.totalPages &&
      document.querySelector('button#next')?.setAttribute('disabled', true)

    // Next page
    document
      .querySelector('button#next')
      ?.addEventListener('click', async (e) => {
        global.search.page++
        await search(global.search.page)
      })
    // Previous page
    document
      .querySelector('button#prev')
      ?.addEventListener('click', async (e) => {
        global.search.page--
        await search(global.search.page)
      })
  }
}

// Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing')
  results.forEach(({ id, title, poster_path, vote_average }) => {
    const imgSrc = poster_path
      ? `https://image.tmdb.org/t/p/w500/${poster_path}`
      : './images/no-image.jpg'
    const div = document.createElement('div')
    div.classList.add('swiper-slide')
    div.innerHTML = `
      <a href="movie-details.html?id=${id}">
        <img src="${imgSrc}" alt="${title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${vote_average.toFixed(
          1
        )} / 10
      </h4>
    `
    document.querySelector('.swiper-wrapper')?.appendChild(div)
    initSwiper()
  })
}

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

// Fetch data from the https://developer.themoviedb.org/docs API
async function fetchAPIData(endpoint) {
  showSpinner()
  const response = await fetch(
    `${global.api.apiUrl}${endpoint}?api_key=${global.api.apiKey}&language=en-US`
  )
  const data = await response.json()
  hideSpinner()
  return data
}

// Make Request To Search
async function searchAPIData(page = 1) {
  showSpinner()
  const response = await fetch(
    `${global.api.apiUrl}search/${global.search.type}?api_key=${global.api.apiKey}&language=en-US&query=${global.search.term}&page=${page}`
  )
  const data = await response.json()
  hideSpinner()
  return data
}
// async function searchAPIData() {
//   showSpinner()
//   const response = await fetch(
//     `${global.api.apiUrl}search/${global.search.type}?api_key=${global.api.apiKey}&language=en-US&query=${global.search.term}`
//   )
//   const data = await response.json()
//   hideSpinner()
//   return data
// }

function showSpinner() {
  document.querySelector('.spinner')?.classList?.add('show')
}

function hideSpinner() {
  document.querySelector('.spinner')?.classList?.remove('show')
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

// Show Alert
function showAlert(message, className = 'error') {
  const alertEl = document.createElement('div')
  alertEl.classList.add('alert', className)
  alertEl.appendChild(document.createTextNode(message))
  document.querySelector('#alert')?.appendChild(alertEl)
  setTimeout(() => {
    alertEl.remove()
  }, 3000)
}

// function addCommasToNumber(number) {
//   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
// }

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider()
      displayPopularMovies()
      break
    case '/shows.html':
      displayPopularShows()
      break
    case '/movie-details.html':
      displayMovieDetails()
      break
    case '/tv-details.html':
      displayShowDetails()
      break
    case '/search.html':
      search()
      break
  }

  highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)
