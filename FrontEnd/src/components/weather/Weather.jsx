import { useState, useEffect } from "react";
import axios from "axios";

import "./weather.css";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const API_KEY = "4865699bb9d74ca980c165536250303"; // Reemplaza con tu clave de WeatherAPI
  const LOCATION = "Arroyo Seco"; // Ciudad a consultar

  

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${LOCATION}&lang=es`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Error obteniendo el clima:", error);
      }
    };

    fetchWeather();
  }, []);

  if (!weather) return <p>Cargando clima...</p>;

  return (
    <div className="weather ">
        <div className="location-temp">
            
                <h2>{weather.location.name}, {weather.location.region}</h2>
                <h2>{Math.round(weather.current.temp_c)}°C <img src={weather.current.condition.icon} alt="icono clima" /></h2>    
        </div>

    </div>
    
  );
};

export default Weather;
