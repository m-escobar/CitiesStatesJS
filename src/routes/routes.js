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
    let citiesByState = cities.reduce((p, c) => {
      let stateCount = c.Estado;
      
      if (!p.hasOwnProperty(stateCount)) {
        p[stateCount] = 0;
      }
      p[stateCount]++;
      return p;
    }, {});

    let newList = [];
    for(i in citiesByState) newList.push({id: Number(i), cities: citiesByState[i]});
    
    let sorted_list = newList.sort((a, b) => {
      return b.cities - a.cities;
    });

    let result = []
    let state = null;
    for (i = 0; i < 5; i++) {
      state = states.filter(thisState => thisState.ID === sorted_list[i].id.toString())[0]
      result.push(`${state.Sigla} - ${sorted_list[i].cities}`);
    }
    
    res.send(result);
  } catch (err) {
      res.status(400).send({ error: err.message});
      console.log(`ERROR: GET /statesTopFive - ${err.message}`);
  }
});

module.exports = router;
