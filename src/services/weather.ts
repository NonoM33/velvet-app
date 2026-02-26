import { STATION_COORDINATES } from './navitia';
import { Weather } from './types';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

// Weather code mappings from Open-Meteo
const WEATHER_CODES: Record<number, { condition: Weather['condition']; icon: string; description: string }> = {
  0: { condition: 'sunny', icon: '☀️', description: 'Ensoleillé' },
  1: { condition: 'sunny', icon: '🌤️', description: 'Principalement dégagé' },
  2: { condition: 'cloudy', icon: '⛅', description: 'Partiellement nuageux' },
  3: { condition: 'cloudy', icon: '☁️', description: 'Couvert' },
  45: { condition: 'cloudy', icon: '🌫️', description: 'Brouillard' },
  48: { condition: 'cloudy', icon: '🌫️', description: 'Brouillard givrant' },
  51: { condition: 'rainy', icon: '🌧️', description: 'Bruine légère' },
  53: { condition: 'rainy', icon: '🌧️', description: 'Bruine modérée' },
  55: { condition: 'rainy', icon: '🌧️', description: 'Bruine dense' },
  61: { condition: 'rainy', icon: '🌧️', description: 'Pluie légère' },
  63: { condition: 'rainy', icon: '🌧️', description: 'Pluie modérée' },
  65: { condition: 'rainy', icon: '🌧️', description: 'Pluie forte' },
  66: { condition: 'rainy', icon: '🌨️', description: 'Pluie verglaçante' },
  67: { condition: 'rainy', icon: '🌨️', description: 'Pluie verglaçante forte' },
  71: { condition: 'snowy', icon: '🌨️', description: 'Neige légère' },
  73: { condition: 'snowy', icon: '🌨️', description: 'Neige modérée' },
  75: { condition: 'snowy', icon: '❄️', description: 'Neige forte' },
  77: { condition: 'snowy', icon: '🌨️', description: 'Grains de neige' },
  80: { condition: 'rainy', icon: '🌦️', description: 'Averses légères' },
  81: { condition: 'rainy', icon: '🌦️', description: 'Averses modérées' },
  82: { condition: 'rainy', icon: '⛈️', description: 'Averses violentes' },
  85: { condition: 'snowy', icon: '🌨️', description: 'Averses de neige légères' },
  86: { condition: 'snowy', icon: '❄️', description: 'Averses de neige fortes' },
  95: { condition: 'stormy', icon: '⛈️', description: 'Orage' },
  96: { condition: 'stormy', icon: '⛈️', description: 'Orage avec grêle légère' },
  99: { condition: 'stormy', icon: '⛈️', description: 'Orage avec grêle forte' },
};

// Get current weather for a city
export async function getWeather(city: string): Promise<Weather | null> {
  const normalizedCity = city.toLowerCase().trim();
  const coords = STATION_COORDINATES[normalizedCity];

  if (!coords) {
    console.log('No coordinates found for city:', city);
    return null;
  }

  try {
    const url = `${OPEN_METEO_BASE_URL}/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Open-Meteo API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data?.current_weather) {
      return null;
    }

    const weatherCode = data.current_weather.weathercode || 0;
    const weatherInfo = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];

    return {
      temperature: Math.round(data.current_weather.temperature),
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      description: weatherInfo.description,
    };
  } catch (error) {
    console.error('getWeather error:', error);
    return null;
  }
}

// Get weather for multiple cities at once
export async function getWeatherBatch(cities: string[]): Promise<Record<string, Weather>> {
  const results: Record<string, Weather> = {};

  await Promise.all(
    cities.map(async (city) => {
      const weather = await getWeather(city);
      if (weather) {
        results[city.toLowerCase()] = weather;
      }
    })
  );

  return results;
}

// Cache for weather data (simple in-memory cache)
const weatherCache: Map<string, { weather: Weather; timestamp: number }> = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Get cached weather or fetch fresh
export async function getWeatherCached(city: string): Promise<Weather | null> {
  const key = city.toLowerCase().trim();
  const cached = weatherCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.weather;
  }

  const weather = await getWeather(city);

  if (weather) {
    weatherCache.set(key, { weather, timestamp: Date.now() });
  }

  return weather;
}

// Default weather data as fallback
export function getFallbackWeather(city: string): Weather {
  const fallbacks: Record<string, Weather> = {
    paris: { temperature: 16, condition: 'cloudy', icon: '☁️', description: 'Couvert' },
    bordeaux: { temperature: 18, condition: 'sunny', icon: '☀️', description: 'Ensoleillé' },
    nantes: { temperature: 15, condition: 'cloudy', icon: '⛅', description: 'Nuageux' },
    rennes: { temperature: 14, condition: 'rainy', icon: '🌧️', description: 'Pluie légère' },
    lyon: { temperature: 20, condition: 'sunny', icon: '☀️', description: 'Ensoleillé' },
    marseille: { temperature: 22, condition: 'sunny', icon: '☀️', description: 'Ensoleillé' },
    lille: { temperature: 12, condition: 'cloudy', icon: '☁️', description: 'Couvert' },
  };

  return fallbacks[city.toLowerCase()] || { temperature: 15, condition: 'cloudy', icon: '⛅', description: 'Variable' };
}
