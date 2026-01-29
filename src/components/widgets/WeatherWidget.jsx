import { memo } from 'react';
import { Cloud, CloudRain, Sun } from 'lucide-react';

function WeatherWidget({ data = {} }) {
  const city = data?.city || 'Berlin';
  
  // Demo-Daten (in Produktion würde hier eine echte API wie OpenWeather verwendet)
  const mockWeather = {
    temp: 18,
    condition: 'Teilweise bewölkt',
    humidity: 65,
    wind: 12
  };

  const getWeatherIcon = () => {
    const condition = mockWeather.condition.toLowerCase();
    if (condition.includes('regen')) return <CloudRain className="w-12 h-12 text-blue-500" />;
    if (condition.includes('bewölkt')) return <Cloud className="w-12 h-12 text-gray-500" />;
    return <Sun className="w-12 h-12 text-yellow-500" />;
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {city}
        </h4>
        <div className="flex justify-center mb-4">
          {getWeatherIcon()}
        </div>
        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {mockWeather.temp}°C
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {mockWeather.condition}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Luftfeuchtigkeit</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            {mockWeather.humidity}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Wind</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            {mockWeather.wind} km/h
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(WeatherWidget);
