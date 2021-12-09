'use strict';
const weatherData = require('./data/weather.json');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

const PORT = process.env.PORT;

app.get('/weather', handleGetWeather)

function handleGetWeather(request, response) {
  // const lat = request.query.lat
  // const lon = request.query.lon
  // const city_name = request.query.city_name
  console.log('REQUEST.QUERY',request.query);
  const requestURL = `https://api.weatherbit.io/v2.0/current?lat=${request.query.lat}&lon=${request.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`
  axios.get(requestURL).then(responseObject => console.log(responseObject)).catch(error => console.error(error));

  // let cityMatch = weatherData.find(cityObject => cityObject.city_name.toLowerCase() === city_name.toLowerCase());
  // if(cityMatch) {
  //   let weatherDescriptions = cityMatch.data.map(cityBlob => new Forecast(cityBlob));
    // let locations = weatherData.map(cityObject => new Location(cityObject)); 
    // response.status(200).send(weatherDescriptions);
    // response.status(200).send(locations);
//   } else {
//     response.status(400).send('Sorry, no data on that city')
//   }
}

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `A high of ${obj.max_temp}, a low of ${obj.low_temp}, with ${obj.weather.description}`
  }
}

// class Location {
//   constructor(obj) {
//     this.lat = obj.lat;
//     this.lon = obj.lon;
//     this.locationString = `The latitude of ${obj.city_name} is ${obj.lat}, and the longitude is ${obj.lon}.`;
//   }
// }

app.listen(PORT, () => console.log('server is listening on port ', PORT));
