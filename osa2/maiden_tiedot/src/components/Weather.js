import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ countryLatLngArr }) => {
  const [weatherData, setWeatherData] = useState('');
  //console.log(countryLatLngArr);

  useEffect(() => {
    // Found this kind of weather API that does not require and API key
    // Unfortunately weather can only be fetched by latitude and longiture
    // so we will use the country coordinates for this service
    // http://www.7timer.info/doc.php?lang=en#api

    // Example country: Finland
    // http://www.7timer.info/bin/api.pl?lon=26&lat=64&product=civillight&output=json


    const lat = countryLatLngArr[0];
    const lng = countryLatLngArr[1];
    //console.log(lat, lng);
    const url = `http://www.7timer.info/bin/api.pl?lon=${lng}&lat=${lat}&product=civillight&output=json`;
    console.log(`Countries :: useEffect :: calling ${url}`);

    axios
      .get(url)
      .then(response => {
        console.log(response.data.dataseries[0]);
        setWeatherData(response.data.dataseries[0]);
      })
      .catch(error => console.log('ERROR', error));

  }, [countryLatLngArr]);


  if (weatherData === '') {
    return <p>Fetching weather data from <code>http://www.7timer.info</code> ...</p>
  }

  return (
    <>
      <h2>Weather in country, date: {weatherData.date}</h2>
      <p><strong>weather</strong>{' '}{weatherData.weather}</p>
      <p><strong>max temp</strong>{' '}{weatherData.temp2m.max} Celsius</p>
      <p><strong>min temp</strong>{' '}{weatherData.temp2m.min} Celsius</p>
    </>
  );

};

export default Weather;
