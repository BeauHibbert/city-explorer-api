'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.get('/weather', handleGetWeather)
app.get('/*', ((req, res) => res.status(404).send('route not found')));

const PORT = process.env.PORT;

function handleGetWeather(request, response) {
  // const currentWeatherURL = `https://api.weatherbit.io/v2.0/current?lat=${request.query.lat}&lon=${request.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`
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

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    // description that works with currentWeatherURL
    // this.description = `A temp of ${obj.temp} and ${obj.weather.description.toLowerCase()}.`
    // description that works with dailyWeatherURL
    this.description = `A high of ${obj.max_temp}, a low of ${obj.low_temp}, and ${obj.weather.description.toLowerCase()}.`
  }
}

app.listen(PORT, () => console.log('server is listening on port ', PORT));
