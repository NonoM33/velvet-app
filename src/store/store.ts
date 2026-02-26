import { create } from 'zustand';
import { Train, Trip, UserProfile, ChatMessage, PriceAlert, Station } from '../services/types';
import { mockUser, userTrips, pastTrips, priceAlerts, stations } from '../services/mockData';

interface AppState {
  // User
  user: UserProfile;
  setUser: (user: UserProfile) => void;

  // Trips
  upcomingTrips: Trip[];
  pastTrips: Trip[];
  addTrip: (trip: Trip) => void;

  // Search
  searchResults: Train[];
  setSearchResults: (trains: Train[]) => void;
  selectedOrigin: Station | null;
  selectedDestination: Station | null;
  setSelectedOrigin: (station: Station | null) => void;
  setSelectedDestination: (station: Station | null) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;

  // Price Alerts
  priceAlerts: PriceAlert[];
  addPriceAlert: (alert: PriceAlert) => void;
  removePriceAlert: (id: string) => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // User
  user: mockUser,
  setUser: (user) => set({ user }),

  // Trips
  upcomingTrips: userTrips,
  pastTrips: pastTrips,
  addTrip: (trip) =>
    set((state) => ({
      upcomingTrips: [...state.upcomingTrips, trip],
    })),

  // Search
  searchResults: [],
  setSearchResults: (trains) => set({ searchResults: trains }),
  selectedOrigin: stations.paris,
  selectedDestination: null,
  setSelectedOrigin: (station) => set({ selectedOrigin: station }),
  setSelectedDestination: (station) => set({ selectedDestination: station }),

  // Chat
  chatMessages: [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Bonjour ! 👋 Je suis ton assistant Velvet AI. Comment puis-je t'aider pour ton prochain voyage en train ? 🚄\n\nTu peux me demander :\n• Des horaires et prix de trains\n• Des conseils sur le meilleur moment pour acheter\n• Des informations sur tes trajets",
      timestamp: new Date().toISOString(),
      suggestions: [
        'Paris → Bordeaux demain',
        'Prochain train pour Nantes',
        'Meilleur prix Paris-Rennes',
      ],
    },
  ],
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  clearChat: () =>
    set({
      chatMessages: [
        {
          id: 'welcome',
          role: 'assistant',
          content:
            "Bonjour ! 👋 Je suis ton assistant Velvet AI. Comment puis-je t'aider pour ton prochain voyage en train ? 🚄",
          timestamp: new Date().toISOString(),
          suggestions: [
            'Paris → Bordeaux demain',
            'Prochain train pour Nantes',
            'Meilleur prix Paris-Rennes',
          ],
        },
      ],
    }),
  isTyping: false,
  setIsTyping: (typing) => set({ isTyping: typing }),

  // Price Alerts
  priceAlerts: priceAlerts,
  addPriceAlert: (alert) =>
    set((state) => ({
      priceAlerts: [...state.priceAlerts, alert],
    })),
  removePriceAlert: (id) =>
    set((state) => ({
      priceAlerts: state.priceAlerts.filter((a) => a.id !== id),
    })),

  // UI State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
