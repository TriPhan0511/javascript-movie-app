// Fetch Data
// Popular movies
// `https://api.themoviedb.org/3/movie/popular?language=en-US`
// Popular TV Shows
// `https://api.themoviedb.org/3/tv/popular?language=en-US`
// Movie Details
// `https://api.themoviedb.org/3/movie/movie_id?language=en-US`
// TV Show Details
// `https://api.themoviedb.org/3/tv/series_id?language=en-US`
// Now playing
// `https://api.themoviedb.org/3/movie/movie/now_playing?language=en-US`
// Search Movie/Show
// https://api.themoviedb.org/3/search/movie?language=en-US&query=$freelance&page=1
// https://api.themoviedb.org/3/search/tv?language=en-US&query=$freelance&page=1

// const API_KEY = '72597d8d62e1a0cc5f6e35a022fa82ea'

// --------------------------------------------------------------------------------------

// Global states
const global = {
  api_key: '72597d8d62e1a0cc5f6e35a022fa82ea',
  imagePath: 'https://image.tmdb.org/t/p/',
}

switch (window.location.pathname) {
  case '/':
  case '/index.html':
    // console.log('Home')
    displayPopularMovies()
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

// Fectch data from https://themoviedb.org
async function fetchData(endpoint = 'movie/popular') {
  let response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?api_key=${global.api_key}&language=en-US`
  )
  response = await response.json()
  return response
}

// Display popular movies
async function displayPopularMovies() {
  const { results } = await fetchData('movie/popular')
  console.log(results)
  results.forEach(({ id, title, poster_path, release_date }) => {
    const imgSrc = poster_path
      ? `${global.imagePath}w500${poster_path}`
      : '/images/no-image.jpg'
    console.log(imgSrc)
    const releaseDateString = `Release Date: ${new Date(
      release_date
    ).toLocaleDateString()}`
    // const releaseDateString = new Date(release_date).toLocaleDateString()
    const card = createCard(id, title, imgSrc, releaseDateString)
    document.querySelector('#popular-movies')?.appendChild(card)
  })
}

// UTILITY FUNCTIONS
// Create a card
function createCard(id, title, imgSrc, releaseDateString) {
  const div = document.createElement('div')
  div.classList.add('card')
  div.innerHTML = `
    <a href="movie-details.html?id=${id}"
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
// function createCard(imgSrc, id, title, releaseDate) {
//   const div = document.createElement('div')
//   div.classList.add('card')
//   div.innerHTML = `
//     <a href="movie-details.html?id=1"
//       ><img
//         src="images/no-image.jpg"
//         alt="Movie Title"
//         class="card-img-top"
//     /></a>
//     <div class="card-body">
//       <h5 class="card-title">Movie Title</h5>
//       <p class="card-text">
//         <small class="text-muted">Release: XX/XX/XXXX</small>
//       </p>
//     </div>
//   `
//   return div
// }
