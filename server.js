'use strict';

require('dotenv').config();
const handleGetWeather = require('./routeHandlers/weather.js');
const handleGetMovies = require('./routeHandlers/movies.js');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.get('/weather', handleGetWeather)
app.get('/movies', handleGetMovies)
app.get('/*', ((req, res) => res.status(404).send('route not found')));  

app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));
