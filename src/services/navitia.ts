import { Train, Station, SearchParams } from './types';
import {
  stations,
  parisBordeauxTrains,
  parisNantesTrains,
  parisRennesTrains,
} from './mockData';

// Navitia API configuration
// This is the public sandbox token from Navitia documentation
const NAVITIA_API_TOKEN = '3b036afe-0110-4202-b9ed-99718476c2e0';
const NAVITIA_BASE_URL = 'https://api.navitia.io/v1';

// Station IDs for Navitia API
const NAVITIA_STATION_IDS: Record<string, string> = {
  paris: 'stop_area:SNCF:87391003', // Paris Montparnasse
  bordeaux: 'stop_area:SNCF:87581009', // Bordeaux Saint-Jean
  nantes: 'stop_area:SNCF:87481002', // Nantes
  rennes: 'stop_area:SNCF:87471003', // Rennes
  lyon: 'stop_area:SNCF:87723197', // Lyon Part-Dieu
  marseille: 'stop_area:SNCF:87751008', // Marseille Saint-Charles
  lille: 'stop_area:SNCF:87286005', // Lille Flandres
};

// Station coordinates for weather lookup
export const STATION_COORDINATES: Record<string, { lat: number; lon: number }> = {
  paris: { lat: 48.8414, lon: 2.3187 },
  bordeaux: { lat: 44.8256, lon: -0.5561 },
  nantes: { lat: 47.2173, lon: -1.5419 },
  rennes: { lat: 48.1035, lon: -1.6726 },
  lyon: { lat: 45.7604, lon: 4.8596 },
  marseille: { lat: 43.3027, lon: 5.3803 },
  lille: { lat: 50.6365, lon: 3.0695 },
};

// Helper to make authenticated Navitia API calls
async function navitiaFetch(endpoint: string): Promise<any> {
  const url = `${NAVITIA_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': NAVITIA_API_TOKEN,
      },
    });

    if (!response.ok) {
      console.error(`Navitia API Error: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Navitia API fetch error:', error);
    return null;
  }
}

// Search for places/stations by query
export async function searchPlaces(query: string): Promise<{ id: string; name: string; city: string }[]> {
  if (!query || query.length < 2) return [];

  try {
    const data = await navitiaFetch(
      `/coverage/sncf/places?q=${encodeURIComponent(query)}&type[]=stop_area&count=10`
    );

    if (!data?.places) return [];

    return data.places
      .filter((place: any) => place.embedded_type === 'stop_area')
      .map((place: any) => ({
        id: place.id,
        name: place.name,
        city: place.stop_area?.administrative_regions?.[0]?.name || place.name.split(' ')[0],
      }));
  } catch (error) {
    console.error('searchPlaces error:', error);
    return [];
  }
}

// Get real-time departures from a station
export interface Departure {
  trainNumber: string;
  destination: string;
  departureTime: string;
  delay: number;
  platform?: string;
}

export async function getDepartures(stationCity: string, count: number = 5): Promise<Departure[]> {
  const stationId = NAVITIA_STATION_IDS[stationCity.toLowerCase()];
  if (!stationId) return [];

  try {
    const data = await navitiaFetch(
      `/coverage/sncf/stop_areas/${stationId}/departures?count=${count}`
    );

    if (!data?.departures) return [];

    return data.departures.map((dep: any) => ({
      trainNumber: dep.display_informations?.headsign || dep.display_informations?.trip_short_name || 'N/A',
      destination: dep.display_informations?.direction || 'N/A',
      departureTime: dep.stop_date_time?.departure_date_time || '',
      delay: 0, // Navitia doesn't always provide delay info in departures endpoint
      platform: dep.stop_point?.platform_code || undefined,
    }));
  } catch (error) {
    console.error('getDepartures error:', error);
    return [];
  }
}

// Get current disruptions
export interface Disruption {
  id: string;
  severity: string;
  title: string;
  message: string;
  affectedLines: string[];
  startDate: string;
  endDate: string;
}

export async function getDisruptions(): Promise<Disruption[]> {
  try {
    const now = new Date().toISOString().replace(/[:-]/g, '').split('.')[0];
    const data = await navitiaFetch(
      `/coverage/sncf/disruptions?since=${now}&count=10`
    );

    if (!data?.disruptions) return [];

    return data.disruptions
      .filter((d: any) => d.severity?.effect === 'SIGNIFICANT_DELAYS' || d.severity?.effect === 'REDUCED_SERVICE')
      .slice(0, 5)
      .map((d: any) => ({
        id: d.id,
        severity: d.severity?.effect || 'UNKNOWN',
        title: d.messages?.[0]?.text?.substring(0, 100) || 'Perturbation en cours',
        message: d.messages?.[0]?.text || 'Consultez les horaires',
        affectedLines: d.impacted_objects?.map((obj: any) => obj.pt_object?.name).filter(Boolean) || [],
        startDate: d.application_periods?.[0]?.begin || '',
        endDate: d.application_periods?.[0]?.end || '',
      }));
  } catch (error) {
    console.error('getDisruptions error:', error);
    return [];
  }
}

// Search for journeys between two stations
export interface JourneyResult {
  id: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  transfers: number;
  trainNumbers: string[];
  co2: number;
}

export async function searchJourneys(
  fromCity: string,
  toCity: string,
  datetime?: string
): Promise<JourneyResult[]> {
  const fromId = NAVITIA_STATION_IDS[fromCity.toLowerCase()];
  const toId = NAVITIA_STATION_IDS[toCity.toLowerCase()];

  if (!fromId || !toId) {
    console.log('Station IDs not found for:', fromCity, toCity);
    return [];
  }

  const dt = datetime || new Date().toISOString().replace(/[:-]/g, '').split('.')[0];

  try {
    const data = await navitiaFetch(
      `/coverage/sncf/journeys?from=${fromId}&to=${toId}&datetime=${dt}&count=5`
    );

    if (!data?.journeys) return [];

    return data.journeys
      .filter((j: any) => j.type === 'best' || j.type === 'rapid' || j.type === 'comfort')
      .map((journey: any, index: number) => ({
        id: `journey-${index}-${Date.now()}`,
        departureTime: journey.departure_date_time || '',
        arrivalTime: journey.arrival_date_time || '',
        duration: Math.round((journey.duration || 0) / 60), // Convert to minutes
        transfers: (journey.nb_transfers || 0),
        trainNumbers: journey.sections
          ?.filter((s: any) => s.type === 'public_transport')
          .map((s: any) => s.display_informations?.headsign || s.display_informations?.trip_short_name || 'TGV')
          || ['TGV'],
        co2: Math.round(journey.co2_emission?.value || 0),
      }));
  } catch (error) {
    console.error('searchJourneys error:', error);
    return [];
  }
}

// Convert Navitia journey to our Train type (with mock pricing as Navitia doesn't provide prices)
export function journeyToTrain(
  journey: JourneyResult,
  fromStation: Station,
  toStation: Station
): Train {
  // Generate realistic mock prices based on duration and time of day
  const basePrice = Math.round(15 + (journey.duration / 60) * 15);
  const hourOfDay = new Date(journey.departureTime).getHours();
  const peakMultiplier = (hourOfDay >= 7 && hourOfDay <= 9) || (hourOfDay >= 17 && hourOfDay <= 19) ? 1.3 : 1;
  const price = Math.round(basePrice * peakMultiplier);
  const originalPrice = Math.random() > 0.5 ? Math.round(price * 1.3) : undefined;

  return {
    id: journey.id,
    trainNumber: journey.trainNumbers[0] || 'TGV',
    departure: {
      station: fromStation,
      time: formatNavitiaDateTime(journey.departureTime),
      platform: undefined,
    },
    arrival: {
      station: toStation,
      time: formatNavitiaDateTime(journey.arrivalTime),
      platform: undefined,
    },
    duration: journey.duration,
    price,
    originalPrice,
    currency: 'EUR',
    occupancy: Math.random() < 0.3 ? 'low' : Math.random() < 0.7 ? 'medium' : 'high',
    class: '2nd',
    amenities: ['wifi', 'power'],
    isRecommended: price === Math.min(price, basePrice),
    priceRecommendation: price < basePrice * 1.1 ? 'buy_now' : 'neutral',
    pricePrediction: {
      trend: Math.random() > 0.5 ? 'up' : 'stable',
      confidence: 0.7 + Math.random() * 0.2,
      predictedPrice: Math.round(price * (1 + Math.random() * 0.2)),
    },
    aiScore: Math.round(70 + Math.random() * 25),
  };
}

// Helper to format Navitia datetime to ISO string
function formatNavitiaDateTime(navitiaDateTime: string): string {
  if (!navitiaDateTime) return new Date().toISOString();

  // Navitia format: YYYYMMDDTHHmmss
  const year = navitiaDateTime.substring(0, 4);
  const month = navitiaDateTime.substring(4, 6);
  const day = navitiaDateTime.substring(6, 8);
  const hour = navitiaDateTime.substring(9, 11);
  const minute = navitiaDateTime.substring(11, 13);
  const second = navitiaDateTime.substring(13, 15);

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toISOString();
}

// Search trains using real API with fallback to mock data
export async function searchTrains(params: SearchParams): Promise<Train[]> {
  const { origin, destination } = params;

  try {
    // Try real API first
    const journeys = await searchJourneys(origin.city, destination.city);

    if (journeys.length > 0) {
      return journeys.map(j => journeyToTrain(j, origin, destination));
    }
  } catch (error) {
    console.error('searchTrains API error, falling back to mock data:', error);
  }

  // Fallback to mock data
  const originCity = origin.city.toLowerCase();
  const destCity = destination.city.toLowerCase();

  if (originCity === 'paris' && destCity === 'bordeaux') {
    return parisBordeauxTrains;
  }
  if (originCity === 'paris' && destCity === 'nantes') {
    return parisNantesTrains;
  }
  if (originCity === 'paris' && destCity === 'rennes') {
    return parisRennesTrains;
  }

  return [];
}

// Synchronous version for backwards compatibility (uses mock data)
export function searchTrainsByCity(
  originCity: string,
  destinationCity: string
): Train[] {
  const normalizedOrigin = originCity.toLowerCase().trim();
  const normalizedDestination = destinationCity.toLowerCase().trim();

  if (normalizedOrigin === 'paris' && normalizedDestination === 'bordeaux') {
    return parisBordeauxTrains;
  }
  if (normalizedOrigin === 'paris' && normalizedDestination === 'nantes') {
    return parisNantesTrains;
  }
  if (normalizedOrigin === 'paris' && normalizedDestination === 'rennes') {
    return parisRennesTrains;
  }

  return [];
}

// Async version that tries real API first
export async function searchTrainsByCityAsync(
  originCity: string,
  destinationCity: string
): Promise<Train[]> {
  const normalizedOrigin = originCity.toLowerCase().trim();
  const normalizedDestination = destinationCity.toLowerCase().trim();

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
  await new Promise(resolve => setTimeout(resolve, 500));

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
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '--:--';
  }
}

// Format date helper
export function formatDate(isoString: string): string {
  if (!isoString) return 'Date inconnue';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Date inconnue';
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  } catch {
    return 'Date inconnue';
  }
}

// Get countdown to departure
export function getCountdown(departureTime: string): {
  days: number;
  hours: number;
  minutes: number;
  isToday: boolean;
  isTomorrow: boolean;
} | null {
  if (!departureTime) return null;

  try {
    const now = new Date();
    const departure = new Date(departureTime);

    if (isNaN(departure.getTime())) return null;

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
  } catch {
    return null;
  }
}
