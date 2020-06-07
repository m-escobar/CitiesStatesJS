const express = require('express');
var fs = require('fs').promises;

const CSRouter = require('./routes/routes.js');
const app = express();

global.allStates = null;
global.allCities = null;

app.use(express.json());

app.use('/', CSRouter);

app.listen(3000, async () => {
  statesFile = './src/data/States.json';
  citiesFile = './src/data/Cities.json';

  try {
    statesData = await fs.readFile(statesFile, 'utf-8');
    citiesData = await fs.readFile(citiesFile, 'utf-8');

    global.allStates = JSON.parse(statesData);
    global.allCities = JSON.parse(citiesData);

    console.log('API Working');
  } catch(err) {
    console.log('ERROR: Data files not found');
  };
});
