import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ countryLatLngArr }) => {
  const [weatherData, setWeatherData] = useState('');

  useEffect(() => {
    // Found this kind of weather API that does not require an API key
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

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    axios
      .get(url, { cancelToken: source.token })
      .then(response => {
        console.log(response.data.dataseries[0]);
        setWeatherData(response.data.dataseries[0]);
      })
      .catch(error => console.log('ERROR', error));

    // The below return function is used to prevent the following error in case the Weather component
    // has been unmounted before the weather data has arrived.
    //
    // Error: encountered when using <React.StrinctMode>
    //  "Can't perform a React state update on an unmounted component.
    //  This is a no-op, but it indicates a memory leak in your application.
    //  To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function."
    //
    // This case happens when the component is still fetching the weather data and the user clears out the
    // filter field in the 'find countries' input.
    //
    // The React doumentation has the following to say about cleanup in useEffect
    // https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    //
    // The axios request is cancelled when the component is unmounted by
    // following the instructions from axios pages: https://github.com/axios/axios#cancellation
    return () => {
      source.cancel('Component was maybe unmounted, weather data fetch operation cancelled');
    }
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
