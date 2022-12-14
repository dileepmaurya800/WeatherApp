import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import WeatherWidget from './components/WeatherWidget';
// mock data for testing without API call
import testData from './testData.json';

const OPEN_WEATHER_MAP_KEY = 'b45402d6988bcdaa3c450f8de036f286';

const cities = [
  { city: 'Delhi', label: 'IND Delhi' },
  { city: 'Kolkata', label: 'IND Kolkata' },
  { city: 'Mumbai', label: 'IND Mumbai' },
  { city: 'Bengaluru', label: 'IND Bengaluru' },
  { city: 'Patana', label: 'IND Patana' },
  { city: 'Chandigarh', label: 'IND Chandigarh' },
  { city: 'Ahemdabad', label: 'IND Ahemdabad' },
  { city: 'Goa', label: 'IND Goa' },
  { city: 'Kocchi', label: 'IND Kocchi' },
  { city: 'Lucknow', label: 'IND Lucknow' },
];

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const city = params.get('city_index');

  const [cityIndex, setCityIndex] = useState(city || 0);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const fetchWeatherAsync = async (cityId) => {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            q: cityId,
            lang: 'zh_tw',
            appid: OPEN_WEATHER_MAP_KEY,
            units: 'metric',
          },
        },
      );
      const transformData = await response.data.list.map((data) => ({
        dt: data.dt,
        temp: data.main.temp,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
        icon: data.weather[0].icon,
        desc: data.weather[0].description,
        clouds: data.clouds.all,
        wind: data.wind.speed,
      }));
      console.log(response)
      setForecast(transformData);
    } catch (err) {
      if (OPEN_WEATHER_MAP_KEY.length === 0) {
        // Use mock data if no key
        const transformData = await testData.list.map((data) => ({
          dt: data.dt,
          temp: data.main.temp,
          temp_min: data.main.temp_min,
          temp_max: data.main.temp_max,
          humidity: data.main.humidity,
          icon: data.weather[0].icon,
          desc: data.weather[0].description,
          clouds: data.clouds.all,
          wind: data.wind.speed,
        }));
        setForecast(transformData);
        setError('');
      } else {
        setError(err.stack);
      }
    }
  };

  useEffect(() => {
    fetchWeatherAsync(cities[cityIndex].city);
  }, []); 

  return (
    <div className="App">
      {error.length === 0 ? (
        <WeatherWidget
          config={{
            location: cities[cityIndex].label,
            unit: 'metric',
            locale: 'zh-tw',
            onLocationClick: () => {
              if (cityIndex + 1 >= cities.length) {
                setCityIndex(0);
                fetchWeatherAsync(cities[0].city);
              } else {
                setCityIndex(cityIndex + 1);
                fetchWeatherAsync(cities[cityIndex + 1].city);
              }
            },
          }}
          forecast={forecast}
        />
      ) : (
        <div>
          <h2>Unable to fetch weather data!</h2>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
};

export default App;