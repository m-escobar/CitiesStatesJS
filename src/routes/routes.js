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


router.get('/statesFiveCities/:order', (req, res) => {
  const order = req.params.order.toLowerCase();
  states = allStates;
  cities = allCities;

  let newList = [];
  let sorted_list = null;
  let result = [];
  let state = null;

  try {
    let citiesByState = cities.reduce((p, c) => {
      let stateCount = c.Estado;
      
      if (!p.hasOwnProperty(stateCount)) {
        p[stateCount] = 0;
      }
      p[stateCount]++;
      return p;
    }, {});

    for(i in citiesByState) newList.push({id: Number(i), cities: citiesByState[i]});
    
    
    if(order === 'top') {
      sorted_list = newList.sort((a, b) => {
        return b.cities - a.cities;
      });
    } else if(order === 'bottom') {
      sorted_list = newList.sort((a, b) => {
        return a.cities - b.cities;
      });
    }
    
    for (i = 0; i < 5; i++) {
      state = states.filter(thisState => thisState.ID === sorted_list[i].id.toString())[0]
      result.push(`${state.Sigla} - ${sorted_list[i].cities}`);
    }
    
    res.send(result);
  } catch (err) {
      res.status(400).send({ error: err.message});
      console.log(`ERROR: GET /statesFiveCities - ${err.message}`);
  }
});

router.get('/nameByState/:size', (req, res) => {
  const orderSize = req.params.size.toLowerCase();
  states = allStates;
  cities = allCities;

  let result = [];

  try {
    let citiesNameSizes = [];
    let cityName = null;

    states.forEach(state => {
      nameSize = 0;
      cityName = '';
      let citiesList = cities.filter(city => city.Estado === state.ID);
      
      if(orderSize === 'longer') {
        citiesList.forEach(city => {
          if(city.Nome.length > nameSize) {
            nameSize = city.Nome.length;
            cityName = city.Nome;
          } else if(city.Nome.length === nameSize) {
            
            let twoCities = [cityName, city.Nome]
            let firstCity = twoCities.sort()[0];
            
            if (firstCity === city.Nome) {
              nameSize = city.Nome.length;
              cityName = city.Nome;
            }
          }
        });
      } else if(orderSize === 'shorter') {
          nameSize = 1000;
          citiesList.forEach(city => {
            if(city.Nome.length < nameSize) {
              nameSize = city.Nome.length;
              cityName = city.Nome;
            } else if(city.Nome.length === nameSize) {
            
              let twoCities = [cityName, city.Nome]
              let firstCity = twoCities.sort()[0];
              
              if (firstCity === city.Nome) {
                nameSize = city.Nome.length;
                cityName = city.Nome;
              }
            }
          });
        };

      citiesNameSizes.push([state.Sigla, cityName])
    });

    result = citiesNameSizes;
    
    res.send(result);
  } catch (err) {
      res.status(400).send({ error: err.message});
      console.log(`ERROR: GET /statesFiveCities - ${err.message}`);
  }
});

router.get('/nameSizeAllStates/:size', (req, res) => {
  const orderSize = req.params.size.toLowerCase();
  states = allStates;
  cities = allCities;

  let result = [];

  try {
    let cityName = null;
    let nameSize = 0;
    let stateId = null;
      
    if(orderSize === 'longer') {
      cities.forEach(city => {
        if(city.Nome.length > nameSize) {
          nameSize = city.Nome.length;
          cityName = city.Nome;
          stateId = city.Estado;
        } else if(city.Nome.length === nameSize) {
          
          let twoCities = [cityName, city.Nome]
          let firstCity = twoCities.sort()[0];
          
          if (firstCity === city.Nome) {
            nameSize = city.Nome.length;
            cityName = city.Nome;
            stateId = city.Estado;
          }
        }
      });
    } else if(orderSize === 'shorter') {
        nameSize = 1000;
        cities.forEach(city => {
          if(city.Nome.length < nameSize) {
            nameSize = city.Nome.length;
            cityName = city.Nome;
            stateId = city.Estado;
          } else if(city.Nome.length === nameSize) {
            console.log(`${city.Nome} >>> ${cityName}`);
            let twoCities = [cityName, city.Nome]
            let firstCity = twoCities.sort()[0];
            
            if (firstCity === city.Nome) {
              nameSize = city.Nome.length;
              cityName = city.Nome;
              stateId = city.Estado;
            }
          }
        });
      };

      let state = states.filter(state => state.ID === stateId)[0];
      result = [cityName, state.Sigla];
       
      res.send(result);
  } catch (err) {
      res.status(400).send({ error: err.message});
      console.log(`ERROR: GET /nameSizeAllStates - ${err.message}`);
  }
});

module.exports = router;
