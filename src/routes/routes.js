var express = require('express');
var fs = require('fs').promises;

var router = express.Router();

router.get('/citiesInThisState/:uf', (req, res) => {
  const params = req.params.uf.toUpperCase();

  states = allStates;

  try {
    let stateId = states.filter(state => state.Sigla === params)[0].ID
    let cities = allCities.filter(city => city.Estado === stateId);
    let totalOfCities = cities.length

    res.send(`total of cities is ${totalOfCities}`);
    } catch (err) {
        res.status(400).send({ error: err.message});
        console.log(`ERROR: GET /citiesInThisState/:UF - ${err.message}`);
    }
});


router.get('/statesTopFive', (req, res) => {
  // const params = req.params.uf.toUpperCase();
  states = allStates;
  cities = allCities;

  try {
    var citiesByState = cities.reduce((p, c) => {
      var stateCount = c.Estado;
      if (!p.hasOwnProperty(stateCount)) {
        p[stateCount] = 0;
      }
      p[stateCount]++;
      return p;
    }, {});
    

    // let stateId = states.filter(state => state.Sigla === params)[0].ID
    // let cities = allCities.filter(city => city.Estado === stateId);
    // let totalOfCities = cities.length

    res.send(`Top 5 states in number of cities: ${citiesByState }`);
    } catch (err) {
        res.status(400).send({ error: err.message});
        console.log(`ERROR: GET /statesTopFive - ${err.message}`);
    }
});

module.exports = router;
