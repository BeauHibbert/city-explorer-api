'use strict'

const axios = require('axios');
require('dotenv').config();
let cache = require('./cache.js');

async function handleGetWeather(request, response) {
  const { lat, lon } = request.query;
  const key = 'weather-' + lat + lon;
  const dailyWeatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&units=I`
  
  if (cache[key]) {
    console.log('cache hit on', key)
    console.log('cache object', cache)
    response.status(200).send(cache[key])
    return
  }

  try {
    console.log('cache miss on', key)
    console.log('cache object', cache)
    const weatherResult = await axios.get(dailyWeatherURL)
    .then(responseObject => {
      // any response object that comes back from an Axios request will have a "data" property
      // the shape of responseObject.data is then dictated by the API
      // Weatherbit API sends back a blob with a "data" property on it as well, which is why we have to access the stuff we care about at responseObject.data.data
      let weatherDescription = responseObject.data.data.map(dataBlob => new Forecast(dataBlob));
      cache[key] = weatherDescription;
      response.status(200).send(weatherDescription);
    })
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Sorry, something went wrong! (Status code: 500)');
  }
}

// if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
//   console.log('Cache hit');
// } else {
//   console.log('Cache miss');
//   cache[key] = {};
//   cache[key].timestamp = Date.now();
//   cache[key].data = axios.get(url)
//   .then(response => parseWeather(response.body));
// }

// return cache[key].data;

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `A high of ${obj.max_temp}, a low of ${obj.low_temp}, and ${obj.weather.description.toLowerCase()}.`
  }
}

module.exports = handleGetWeather;

// const { lat, lon } = request.query;
//   weather(lat, lon)
//   .then(summaries => response.send(summaries))
//   .catch((error) => {
//     console.error(error);
//     response.status(500).send('Sorry. Something went wrong!')
//   });

// function parseWeather(weatherData) {
//   try {
//     const weatherSummaries = weatherData.data.map(day => {
//       return new Weather(day);
//     });
//     return Promise.resolve(weatherSummaries);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// }
