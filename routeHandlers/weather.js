'use strict'

const axios = require('axios');
require('dotenv').config();
let cache = require('./cache.js');

async function handleGetWeather(request, response) {
  const { lat, lon } = request.query;
  const key = 'weather-' + lat + lon;

  const dailyWeatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&units=I`;
  
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('cache hit on', key);
    console.log('cache object', cache);
    response.status(200).send(cache[key]);
    return
  } else {
      console.log('Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = axios.get(dailyWeatherURL)
      .then(weatherData => {
        let weatherDescription = weatherData.data.data.map(dataBlob => new Forecast(dataBlob));
        cache[key] = weatherDescription;
        response.status(200).send(weatherDescription);
      })
    }
    return cache[key].data; 
}

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `A high of ${obj.max_temp}, a low of ${obj.low_temp}, and ${obj.weather.description.toLowerCase()}.`
  }
}

module.exports = handleGetWeather;
