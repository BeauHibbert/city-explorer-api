'use strict';

require('dotenv').config();
const handleGetWeather = require('./weather.js');
const handleGetMovies = require('./movies.js');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.get('/weather', handleGetWeather)
app.get('/movies', handleGetMovies)
app.get('/*', ((req, res) => res.status(404).send('route not found')));

const PORT = process.env.PORT;


app.listen(PORT, () => console.log('server is listening on port ', PORT));
