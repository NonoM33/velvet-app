import { Station, Train, Trip, UserProfile, PriceAlert, Weather } from './types';

// Stations
export const stations: Record<string, Station> = {
  paris: {
    id: 'paris-montparnasse',
    name: 'Paris Montparnasse',
    city: 'Paris',
    code: 'PMO',
  },
  bordeaux: {
    id: 'bordeaux-saint-jean',
    name: 'Bordeaux Saint-Jean',
    city: 'Bordeaux',
    code: 'BSJ',
  },
  nantes: {
    id: 'nantes',
    name: 'Nantes',
    city: 'Nantes',
    code: 'NTE',
  },
  rennes: {
    id: 'rennes',
    name: 'Rennes',
    city: 'Rennes',
    code: 'RNS',
  },
  lyon: {
    id: 'lyon-part-dieu',
    name: 'Lyon Part-Dieu',
    city: 'Lyon',
    code: 'LPD',
  },
};

// Helper to generate dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

// Paris → Bordeaux Trains
export const parisBordeauxTrains: Train[] = [
  {
    id: 'train-1',
    trainNumber: 'TGV 8541',
    departure: {
      station: stations.paris,
      time: new Date(tomorrow.setHours(7, 12, 0, 0)).toISOString(),
      platform: '4',
    },
    arrival: {
      station: stations.bordeaux,
      time: new Date(tomorrow.setHours(9, 16, 0, 0)).toISOString(),
      platform: '2',
    },
    duration: 124,
    price: 29,
    originalPrice: 45,
    currency: 'EUR',
    occupancy: 'low',
    class: '2nd',
    amenities: ['wifi', 'power', 'bar'],
    isRecommended: true,
    priceRecommendation: 'buy_now',
    pricePrediction: {
      trend: 'up',
      confidence: 0.85,
      predictedPrice: 45,
    },
  },
  {
    id: 'train-2',
    trainNumber: 'TGV 8543',
    departure: {
      station: stations.paris,
      time: new Date(tomorrow.setHours(8, 47, 0, 0)).toISOString(),
      platform: '7',
    },
    arrival: {
      station: stations.bordeaux,
      time: new Date(tomorrow.setHours(10, 58, 0, 0)).toISOString(),
      platform: '1',
    },
    duration: 131,
    price: 45,
    currency: 'EUR',
    occupancy: 'medium',
    class: '2nd',
    amenities: ['wifi', 'power'],
    priceRecommendation: 'neutral',
    pricePrediction: {
      trend: 'stable',
      confidence: 0.72,
    },
  },
  {
    id: 'train-3',
    trainNumber: 'TGV 8547',
    departure: {
      station: stations.paris,
      time: new Date(tomorrow.setHours(10, 12, 0, 0)).toISOString(),
      platform: '5',
    },
    arrival: {
      station: stations.bordeaux,
      time: new Date(tomorrow.setHours(12, 18, 0, 0)).toISOString(),
      platform: '3',
    },
    duration: 126,
    price: 65,
    currency: 'EUR',
    occupancy: 'high',
    class: '2nd',
    amenities: ['wifi', 'power', 'bar', 'quiet'],
    priceRecommendation: 'wait',
    pricePrediction: {
      trend: 'down',
      confidence: 0.68,
      predictedPrice: 49,
    },
  },
  {
    id: 'train-4',
    trainNumber: 'TGV 8551',
    departure: {
      station: stations.paris,
      time: new Date(tomorrow.setHours(12, 47, 0, 0)).toISOString(),
      platform: '3',
    },
    arrival: {
      station: stations.bordeaux,
      time: new Date(tomorrow.setHours(14, 51, 0, 0)).toISOString(),
      platform: '2',
    },
    duration: 124,
    price: 39,
    currency: 'EUR',
    occupancy: 'low',
    class: '2nd',
    amenities: ['wifi', 'power'],
    priceRecommendation: 'buy_now',
    pricePrediction: {
      trend: 'up',
      confidence: 0.79,
      predictedPrice: 55,
    },
  },
  {
    id: 'train-5',
    trainNumber: 'TGV 8555',
    departure: {
      station: stations.paris,
      time: new Date(tomorrow.setHours(15, 12, 0, 0)).toISOString(),
      platform: '6',
    },
    arrival: {
      station: stations.bordeaux,
      time: new Date(tomorrow.setHours(17, 24, 0, 0)).toISOString(),
      platform: '1',
    },
    duration: 132,
    price: 89,
    currency: 'EUR',
    occupancy: 'high',
    class: '2nd',
    amenities: ['wifi', 'power', 'bar'],
    priceRecommendation: 'wait',
    pricePrediction: {
      trend: 'down',
      confidence: 0.82,
      predictedPrice: 59,
    },
  },
];

// Paris → Nantes Trains
export const parisNantesTrains: Train[] = [
  {
    id: 'train-n1',
    trainNumber: 'TGV 8751',
    departure: {
      station: stations.paris,
      time: new Date(tomorrow.setHours(6, 52, 0, 0)).toISOString(),
      platform: '2',
    },
    arrival: {
      station: stations.nantes,
      time: new Date(tomorrow.setHours(9, 7, 0, 0)).toISOString(),
      platform: '1',
    },
    duration: 135,
    price: 19,
    originalPrice: 35,
    currency: 'EUR',
    occupancy: 'low',
    class: '2nd',
    amenities: ['wifi', 'power'],
    isRecommended: true,
    priceRecommendation: 'buy_now',
    pricePrediction: {
      trend: 'up',
      confidence: 0.91,
      predictedPrice: 39,
    },
  },
  {
    id: 'train-n2',
    trainNumber: 'TGV 8755',
    departure: {
      station: stations.paris,
      time: new Date(tomorrow.setHours(9, 22, 0, 0)).toISOString(),
      platform: '4',
    },
    arrival: {
      station: stations.nantes,
      time: new Date(tomorrow.setHours(11, 34, 0, 0)).toISOString(),
      platform: '3',
    },
    duration: 132,
    price: 35,
    currency: 'EUR',
    occupancy: 'medium',
    class: '2nd',
    amenities: ['wifi', 'power', 'bar'],
    priceRecommendation: 'neutral',
    pricePrediction: {
      trend: 'stable',
      confidence: 0.65,
    },
  },
];

// Paris → Rennes Trains
export const parisRennesTrains: Train[] = [
  {
    id: 'train-r1',
    trainNumber: 'TGV 8031',
    departure: {
      station: stations.paris,
      time: new Date(tomorrow.setHours(7, 35, 0, 0)).toISOString(),
      platform: '1',
    },
    arrival: {
      station: stations.rennes,
      time: new Date(tomorrow.setHours(9, 2, 0, 0)).toISOString(),
      platform: '2',
    },
    duration: 87,
    price: 25,
    currency: 'EUR',
    occupancy: 'low',
    class: '2nd',
    amenities: ['wifi', 'power'],
    isRecommended: true,
    priceRecommendation: 'buy_now',
    pricePrediction: {
      trend: 'up',
      confidence: 0.88,
      predictedPrice: 42,
    },
  },
  {
    id: 'train-r2',
    trainNumber: 'TGV 8035',
    departure: {
      station: stations.paris,
      time: new Date(tomorrow.setHours(10, 5, 0, 0)).toISOString(),
      platform: '3',
    },
    arrival: {
      station: stations.rennes,
      time: new Date(tomorrow.setHours(11, 32, 0, 0)).toISOString(),
      platform: '1',
    },
    duration: 87,
    price: 45,
    currency: 'EUR',
    occupancy: 'medium',
    class: '2nd',
    amenities: ['wifi', 'power', 'quiet'],
    priceRecommendation: 'wait',
    pricePrediction: {
      trend: 'down',
      confidence: 0.75,
      predictedPrice: 32,
    },
  },
];

// User's upcoming trips
export const userTrips: Trip[] = [
  {
    id: 'trip-1',
    train: parisBordeauxTrains[0],
    status: 'upcoming',
    ticketCode: 'VELV-2024-ABC123',
    seat: '47',
    coach: '12',
    bookedAt: new Date().toISOString(),
    passengers: 1,
  },
  {
    id: 'trip-2',
    train: {
      ...parisNantesTrains[0],
      departure: {
        ...parisNantesTrains[0].departure,
        time: new Date(nextWeek.setHours(8, 22, 0, 0)).toISOString(),
      },
      arrival: {
        ...parisNantesTrains[0].arrival,
        time: new Date(nextWeek.setHours(10, 37, 0, 0)).toISOString(),
      },
    },
    status: 'upcoming',
    ticketCode: 'VELV-2024-DEF456',
    seat: '23',
    coach: '8',
    bookedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    passengers: 2,
  },
];

// Past trips for history
export const pastTrips: Trip[] = [
  {
    id: 'trip-past-1',
    train: {
      ...parisBordeauxTrains[1],
      departure: {
        ...parisBordeauxTrains[1].departure,
        time: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      arrival: {
        ...parisBordeauxTrains[1].arrival,
        time: new Date(Date.now() - 86400000 * 7 + 7800000).toISOString(),
      },
    },
    status: 'completed',
    ticketCode: 'VELV-2024-GHI789',
    seat: '15',
    coach: '5',
    bookedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    passengers: 1,
  },
  {
    id: 'trip-past-2',
    train: {
      ...parisRennesTrains[0],
      departure: {
        ...parisRennesTrains[0].departure,
        time: new Date(Date.now() - 86400000 * 14).toISOString(),
      },
      arrival: {
        ...parisRennesTrains[0].arrival,
        time: new Date(Date.now() - 86400000 * 14 + 5220000).toISOString(),
      },
    },
    status: 'completed',
    ticketCode: 'VELV-2024-JKL012',
    seat: '32',
    coach: '3',
    bookedAt: new Date(Date.now() - 86400000 * 21).toISOString(),
    passengers: 1,
  },
];

// User profile
export const mockUser: UserProfile = {
  id: 'user-1',
  name: 'Thomas',
  email: 'thomas@example.com',
  avatar: undefined,
  tier: 'Gold',
  preferences: {
    seatPreference: 'window',
    quietCoach: true,
    defaultClass: '2nd',
    notifications: {
      priceAlerts: true,
      disruptions: true,
      tripReminders: true,
    },
  },
  stats: {
    totalTrips: 47,
    totalDistance: 15840,
    moneySaved: 342,
    co2Avoided: 1267,
    favoriteRoute: {
      origin: 'Paris',
      destination: 'Bordeaux',
      count: 23,
    },
  },
};

// Price alerts
export const priceAlerts: PriceAlert[] = [
  {
    id: 'alert-1',
    route: {
      origin: stations.paris,
      destination: stations.bordeaux,
    },
    targetPrice: 25,
    currentPrice: 29,
    isTriggered: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'alert-2',
    route: {
      origin: stations.paris,
      destination: stations.nantes,
    },
    targetPrice: 15,
    currentPrice: 19,
    isTriggered: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

// Weather data
export const weatherData: Record<string, Weather> = {
  bordeaux: {
    temperature: 18,
    condition: 'sunny',
    icon: '☀️',
    description: 'Ensoleillé',
  },
  nantes: {
    temperature: 15,
    condition: 'cloudy',
    icon: '⛅',
    description: 'Nuageux',
  },
  rennes: {
    temperature: 14,
    condition: 'rainy',
    icon: '🌧️',
    description: 'Pluie légère',
  },
  paris: {
    temperature: 16,
    condition: 'cloudy',
    icon: '☁️',
    description: 'Couvert',
  },
  lyon: {
    temperature: 20,
    condition: 'sunny',
    icon: '☀️',
    description: 'Ensoleillé',
  },
};

// Popular routes for quick search
export const popularRoutes = [
  { origin: stations.paris, destination: stations.bordeaux, label: 'Paris → Bordeaux' },
  { origin: stations.paris, destination: stations.nantes, label: 'Paris → Nantes' },
  { origin: stations.paris, destination: stations.rennes, label: 'Paris → Rennes' },
  { origin: stations.paris, destination: stations.lyon, label: 'Paris → Lyon' },
];

// Chat suggestions
export const chatSuggestions = [
  'Paris → Bordeaux demain',
  'Prochain train pour Nantes',
  'Meilleur prix Paris-Rennes',
  'Quand acheter mon billet ?',
];
