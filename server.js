'use strict';
require('./data/weather.json')
require('dotenv').config();
const express =require('express');
const cors = require('cors');
const list = require('./data/weather.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT;





app.get('/weather', handleGetWeather)






function handleGetWeather(request, response) {
  console.log(request)
  console.log('request.query', request.query)
  // const dataToReturn = list.map(cityDataObject => {
  //   let lon = cityDataObject.lon;
  //   let lat = cityDataObject.lat;
  //   return lon, lat
  // });
  // response.status(200).send(dataToReturn)
  const lat = list.map(cityDataObject => {return cityDataObject.lat});
  const lon = list.map(cityDataObject => {return cityDataObject.lon});
  // response.status(200).write(lon, lat);
  response.status(200).send(lat);
}


app.listen(PORT, () => console.log('server is listening on port ', PORT));
