import { Train, Station, SearchParams } from './types';
import {
  stations,
  parisBordeauxTrains,
  parisNantesTrains,
  parisRennesTrains,
} from './mockData';

// Mock API service - structured for real API integration later
// In production, this would connect to Navitia/SNCF API

export async function searchTrains(params: SearchParams): Promise<Train[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const { origin, destination } = params;

  // Route matching
  if (
    origin.city.toLowerCase() === 'paris' &&
    destination.city.toLowerCase() === 'bordeaux'
  ) {
    return parisBordeauxTrains;
  }

  if (
    origin.city.toLowerCase() === 'paris' &&
    destination.city.toLowerCase() === 'nantes'
  ) {
    return parisNantesTrains;
  }

  if (
    origin.city.toLowerCase() === 'paris' &&
    destination.city.toLowerCase() === 'rennes'
  ) {
    return parisRennesTrains;
  }

  // Return empty for unmatched routes
  return [];
}

export async function searchTrainsByCity(
  originCity: string,
  destinationCity: string
): Promise<Train[]> {
  // Normalize city names
  const normalizedOrigin = originCity.toLowerCase().trim();
  const normalizedDestination = destinationCity.toLowerCase().trim();

  // Find stations
  const originStation = Object.values(stations).find(
    s => s.city.toLowerCase() === normalizedOrigin
  );
  const destinationStation = Object.values(stations).find(
    s => s.city.toLowerCase() === normalizedDestination
  );

  if (!originStation || !destinationStation) {
    return [];
  }

  return searchTrains({
    origin: originStation,
    destination: destinationStation,
    date: new Date().toISOString(),
    passengers: 1,
  });
}

export function getStation(cityName: string): Station | undefined {
  const normalized = cityName.toLowerCase().trim();
  return Object.values(stations).find(
    s =>
      s.city.toLowerCase() === normalized || s.name.toLowerCase().includes(normalized)
  );
}

export function getAllStations(): Station[] {
  return Object.values(stations);
}

export async function getTrainById(trainId: string): Promise<Train | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const allTrains = [
    ...parisBordeauxTrains,
    ...parisNantesTrains,
    ...parisRennesTrains,
  ];

  return allTrains.find(t => t.id === trainId);
}

// Price prediction mock
export async function getPricePrediction(
  route: { origin: string; destination: string },
  currentPrice: number
): Promise<{
  recommendation: 'buy_now' | 'wait' | 'neutral';
  confidence: number;
  predictedChange: number;
  bestDay?: string;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock logic - in production this would be ML-based
  const random = Math.random();

  if (random < 0.3) {
    return {
      recommendation: 'buy_now',
      confidence: 0.85,
      predictedChange: 15,
      bestDay: "Aujourd'hui",
    };
  } else if (random < 0.6) {
    return {
      recommendation: 'wait',
      confidence: 0.72,
      predictedChange: -12,
      bestDay: 'Mardi prochain',
    };
  } else {
    return {
      recommendation: 'neutral',
      confidence: 0.65,
      predictedChange: 0,
    };
  }
}

// Format duration helper
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}min`;
  }

  return `${hours}h${mins.toString().padStart(2, '0')}`;
}

// Format time helper
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format date helper
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// Get countdown to departure
export function getCountdown(departureTime: string): {
  days: number;
  hours: number;
  minutes: number;
  isToday: boolean;
  isTomorrow: boolean;
} {
  const now = new Date();
  const departure = new Date(departureTime);
  const diff = departure.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const departureDate = new Date(departure);
  departureDate.setHours(0, 0, 0, 0);

  return {
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    isToday: departureDate.getTime() === today.getTime(),
    isTomorrow: departureDate.getTime() === tomorrow.getTime(),
  };
}
