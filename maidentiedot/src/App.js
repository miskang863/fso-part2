import { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')

  const hook = () => {
    console.log('fulfilld')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  const handleCountryFilter = (event) => {
    setCountryFilter(event.target.value)
  }

  const countriesFiltered = countries.filter(country => country.name.common.toLowerCase().includes(countryFilter.toLowerCase()))

  return (
    <div>
      find countries <input value={countryFilter} onChange={handleCountryFilter} />
      <Countries countriesFiltered={countriesFiltered} setCountryFilter={setCountryFilter} />
    </div>
  );
}

const Countries = ({ countriesFiltered, setCountryFilter }) => {
  if (countriesFiltered.length < 10 && countriesFiltered.length > 1) {
    return (
      <ul>
        {countriesFiltered.map(country => {
          return (
            <li key={countriesFiltered.indexOf(country)}>{country.name.common}
              <button onClick={(event) => {
                event.preventDefault()
                setCountryFilter(country.name.common)
              }}>
                show
              </button>
            </li>
          )
        })}
      </ul>
    )
  } else if (countriesFiltered.length === 1) {
    return (
      <div>
        <h1>{countriesFiltered[0].name.common}</h1>
        <p>
          Capital: {countriesFiltered[0].capital[0]}<br />
          Area: {countriesFiltered[0].area}
        </p>
        <h3>Languages:</h3>
        <ul>
          {Object.values(countriesFiltered[0].languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={countriesFiltered[0].flags.png} alt={countriesFiltered[0].name.common} />
      </div>

    )

  } else {
    return <p>Too many matches, specify another filter</p>
  }
}


export default App;
