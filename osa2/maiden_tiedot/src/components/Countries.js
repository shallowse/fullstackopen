import React from 'react';

const Countries = ({
  countries = '',
  handleShowCountry = f => f,
}) => {

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length > 1 && countries.length < 10) {
    return (
      <>
        {
          countries.map(country => {
            return (
              <p key={country.name}>
                {country.name}&nbsp;
                <button
                  onClick={() => handleShowCountry(country.name)}
                >
                  show
                </button>
              </p>
            );
          })
        }
      </>
    );
  }

  if (countries.length === 1) {
    const country = countries[0];
    return (
      <>
        <h2>{country.name}</h2>
        <p>capital {country.capital}</p>
        <p>population {country.population}</p>

        <h2>languages</h2>
        <ul>
          {
            country.languages.map(language => <li key={language.name}>{language.name}</li>)
          }
        </ul>
        <img src={country.flag} alt={country.flag} style={{ maxWidth: '250px', height: 'auto' }} />
      </>
    );
  }

  return <h2>Nothing found</h2>;
};

export default Countries;
