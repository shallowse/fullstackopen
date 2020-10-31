// Application structure and funtionality
//
// Components
//
// App: coordinates and fetches the data set of countries from restcountries.eu
//   Countries: renders the country data
//   Weather: fetches country weather data from http://www.7timer.info/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from './components/Countries';
import Weather from './components/Weather';

// This data was used for local testing before implementing the remote fetching of country data.
// import data from './data';

const App = () => {
  const [filterByCountry, setFilterByCounty] = useState('');
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log(response.data);
        setCountryData(response.data)
      })
      .catch(error => console.log('ERROR', error))
  }, []);

  const handleFilterByCountry = (event) => {
    setFilterByCounty(event.target.value);
  };

  const handleShowCountry = (countryName) => {
    console.log('clicked', countryName);
    setFilterByCounty(countryName);
  };

  const countriesToShow = filterByCountry === ''
    ? countryData
    : countryData.filter(country => country.name.toLowerCase().includes(filterByCountry.toLocaleLowerCase()));

  return (
    <div>
      find countries{' '}
      <input
        value={filterByCountry}
        onChange={handleFilterByCountry}
        type="text"
      />
      <br />

      <Countries
        countries={countriesToShow}
        handleShowCountry={handleShowCountry}
      />

      {
        countriesToShow.length === 1
        && <Weather countryLatLngArr={countriesToShow[0].latlng} />
      }
    </div>
  );
};

export default App;
