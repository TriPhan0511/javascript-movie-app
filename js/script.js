// const API_KEY = '72597d8d62e1a0cc5f6e35a022fa82ea'

// // // let endpoint = 'https://api.themoviedb.org/3/movie/11'
// // let endpoint = 'https://api.themoviedb.org/3/movie/1157602'
// // fetch(`${endpoint}?api_key=${API_KEY}`)
// //   .then((res) => res.json())
// //   .then((movie) => {
// //     console.log(movie)
// //     // console.log(movie.title)
// //   })

// // ----------------------------------------------------------------------------
// // const options = {
// //   method: 'GET',
// //   headers: {
// //     accept: 'application/json',
// //     // Authorization: 'Bearer 72597d8d62e1a0cc5f6e35a022fa82ea',
// //   },
// // }

// // // fetch('https://api.themoviedb.org/3/movie/changes?page=1', options)
// // fetch(`https://api.themoviedb.org/3/movie/changes?page=1&api_key=${API_KEY}`)
// //   .then((response) => response.json())
// //   //   .then((response) => console.log(response))
// //   .then((response) => {
// //     // console.log(response)
// //     // console.log(response.results)
// //     console.log(response.results[0])
// //   })
// //   .catch((err) => console.error(err))
// // ----------------------------------------------------------------------------

// const testTheMovieDbApi = (endpoint) => {
//   fetch(`${endpoint}?api_key=${API_KEY}`)
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`Request Failed`)
//       }
//       return res.json()
//     })
//     .then((data) => {
//       console.log(data)
//     })
//     .catch((err) => console.error(err))
// }

// // testTheMovieDbApi('https://api.themoviedb.org/3/movie/now_playing')
// // testTheMovieDbApi('https://api.themoviedb.org/3/movie/1157602')

// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization:
//       'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MjU5N2Q4ZDYyZTFhMGNjNWY2ZTM1YTAyMmZhODJlYSIsInN1YiI6IjY1NmVkZTQ2M2RjMzEzMDEzODdiODg3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bYXf2MZWGaukA6wTTYO2pECV-zXZs2Clk_wQ8jSN0zs',
//   },
// }

// fetch('https://api.themoviedb.org/3/movie/157336?append_to_response=videos&language=en-US', options)
//   .then((response) => response.json())
//   .then((response) => {
//     console.log(response)
//     console.log(response.videos)
//     console.log(response.videos.results)
//     console.log(response.videos.results[0])
//   })
//   .catch((err) => console.error(err))
