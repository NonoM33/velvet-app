// Train & Journey Types
export interface Station {
  id: string;
  name: string;
  city: string;
  code: string;
}

export interface Train {
  id: string;
  trainNumber: string;
  departure: {
    station: Station;
    time: string; // ISO string
    platform?: string;
  };
  arrival: {
    station: Station;
    time: string; // ISO string
    platform?: string;
  };
  duration: number; // in minutes
  price: number;
  originalPrice?: number; // for showing discounts
  currency: string;
  occupancy: 'low' | 'medium' | 'high';
  class: '1st' | '2nd';
  amenities: string[];
  isRecommended?: boolean;
  priceRecommendation?: 'buy_now' | 'wait' | 'neutral';
  pricePrediction?: {
    trend: 'up' | 'down' | 'stable';
    confidence: number;
    predictedPrice?: number;
  };
}

export interface Trip {
  id: string;
  train: Train;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  ticketCode?: string;
  seat?: string;
  coach?: string;
  bookedAt: string;
  passengers: number;
}

export interface SearchParams {
  origin: Station;
  destination: Station;
  date: string;
  time?: string;
  passengers: number;
  class?: '1st' | '2nd';
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  cards?: TrainCardData[];
  suggestions?: string[];
}

export interface TrainCardData {
  type: 'train';
  train: Train;
}

// User Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  seatPreference: 'window' | 'aisle' | 'no_preference';
  quietCoach: boolean;
  defaultClass: '1st' | '2nd';
  notifications: {
    priceAlerts: boolean;
    disruptions: boolean;
    tripReminders: boolean;
  };
}

export interface UserStats {
  totalTrips: number;
  totalDistance: number; // km
  moneySaved: number; // €
  co2Avoided: number; // kg
  favoriteRoute?: {
    origin: string;
    destination: string;
    count: number;
  };
}

// Price Alert Types
export interface PriceAlert {
  id: string;
  route: {
    origin: Station;
    destination: Station;
  };
  targetPrice: number;
  currentPrice: number;
  isTriggered: boolean;
  createdAt: string;
}

// Weather Types
export interface Weather {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  icon: string;
  description: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
