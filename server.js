'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.get('/weather', handleGetWeather)
app.get('/movies', handleGetMovies)
app.get('/*', ((req, res) => res.status(404).send('route not found')));

const PORT = process.env.PORT;

function handleGetWeather(request, response) {
  const dailyWeatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.lat}&lon=${request.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`
  axios.get(dailyWeatherURL)
    .then(responseObject => {
      // any response object that comes back from an Axios request will have a "data" property
      // the shape of responseObject.data is then dictated by the API
      // Weatherbit API sends back a blob with a "data" property on it as well, which is why we have to access the stuff we care about at responseObject.data.data
      let weatherDescription = responseObject.data.data.map(dataBlob => new Forecast(dataBlob));
      response.status(200).send(weatherDescription);
    })
    .catch(error => {
      console.error(error.message);
      response.status(500).send('Sorry, something went wrong! (Status code: 500)');
    });
}

async function handleGetMovies(req, res) {
  const { city_name } = req.query;
  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${city_name}&page=1&include_adult=false`;
    const movieResponse = await axios.get(url);
    const cleanedMovies = movieResponse.data.results.map(movie => new Movie(movie));
    res.send(cleanedMovies);
  } catch (e) {
    res.status(500).send('server error')
  }
}

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `A high of ${obj.max_temp}, a low of ${obj.low_temp}, and ${obj.weather.description.toLowerCase()}.`
  }
}

class Movie {
  constructor(obj) {
    this.title = obj.title;
    this.overview = obj.overview;
    this.avg_votes = obj.vote_average;
    this.total_votes = obj.vote_count;
    this.image_url = obj.poster_path ? `https://.imagetmdb.org/t/p/w500${obj.poster_path}` : `https://www.reelviews.net/resources/img/default_poster.jpg`;
    this.popularity = obj.popularity;
    this.released_on = obj.release_date;
  }
}

app.listen(PORT, () => console.log('server is listening on port ', PORT));
