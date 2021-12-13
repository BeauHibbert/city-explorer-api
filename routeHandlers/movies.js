'use strict';

let cache = require('./cache.js');
require('dotenv').config();
const axios = require('axios');

async function handleGetMovies(req, res) {
  const { city_name } = req.query;
  const key = 'city-' + city_name;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${city_name}&page=1&include_adult=false`;

  if (cache[key]) {
    console.log('cache hit on', key)
    console.log('cache object', cache)
    res.status(200).send(cache[key])
    return
  }
  try {
    console.log('cache miss on', key)
    console.log('cache object', cache)
    const movieResponse = await axios.get(url);
    const cleanedMovies = movieResponse.data.results.map(movie => new Movie(movie));
    cache[key] = cleanedMovies;
    res.status(200).send(cleanedMovies);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('server error')
  }
}

class Movie {
  constructor(obj) {
    this.title = obj.title;
    this.overview = obj.overview;
    this.avg_votes = obj.vote_average;
    this.total_votes = obj.vote_count;
    this.image_url = obj.poster_path ? `https://image.tmdb.org/t/p/w500${obj.poster_path}` : `https://www.reelviews.net/resources/img/default_poster.jpg`;
    this.popularity = obj.popularity;
    this.released_on = obj.release_date;
  }
}

module.exports = handleGetMovies;