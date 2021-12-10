'use strict'

const axios = require('axios');

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

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `A high of ${obj.max_temp}, a low of ${obj.low_temp}, and ${obj.weather.description.toLowerCase()}.`
  }
}

module.exports = handleGetWeather;
