// Demo mode data and scenarios for live presentations
// All data is hardcoded - no real API calls during demo

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  duration: number; // in milliseconds
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'prix_predictif',
    name: 'Prix Prédictif',
    description: 'Animation du prix qui baisse de 89€ à 24€',
    duration: 5000,
  },
  {
    id: 'perturbation',
    name: 'Perturbation Détectée',
    description: 'Alerte perturbation + solution IA',
    duration: 5000,
  },
  {
    id: 'reservation_eclair',
    name: 'Réservation Éclair',
    description: 'Recherche et réservation en 4 secondes',
    duration: 5000,
  },
  {
    id: 'alerte_prix',
    name: 'Alerte Prix Intelligente',
    description: 'Notification push prix en baisse',
    duration: 5000,
  },
  {
    id: 'dernier_kilometre',
    name: 'Dernier Kilomètre',
    description: 'Options de transport à l\'arrivée',
    duration: 5000,
  },
];

// Scenario 1: Prix Prédictif
export const demoPrixPredictif = {
  initialPrice: 89,
  finalPrice: 24,
  animationDuration: 2000,
  confidenceStart: 0,
  confidenceEnd: 94,
  toastMessage: "🤖 L'IA détecte une baisse de prix imminente !",
  route: {
    origin: 'Paris',
    destination: 'Bordeaux',
  },
};

// Scenario 2: Perturbation Détectée
export const demoPerturbation = {
  disruption: {
    id: 'demo-d1',
    trainNumber: 'TGV 8541',
    route: 'Paris → Bordeaux',
    delay: 25,
    message: '⚠️ TGV 8541 Paris→Bordeaux : +25 min de retard',
  },
  solution: {
    trainNumber: 'TGV 8543',
    departureIn: 12,
    message: '🤖 Alternative trouvée : TGV 8543, départ dans 12 min, arrivée identique',
  },
  toastOnSwap: 'Billet modifié ✅',
};

// Scenario 3: Réservation Éclair
export const demoReservationEclair = {
  searchQuery: 'Paris → Nantes samedi',
  results: [
    {
      id: 'demo-t1',
      trainNumber: 'TGV 8921',
      departure: { time: '08:15', station: 'Paris Montparnasse' },
      arrival: { time: '10:27', station: 'Nantes' },
      duration: 132,
      price: 29,
      originalPrice: 45,
      aiRecommended: true,
    },
    {
      id: 'demo-t2',
      trainNumber: 'TGV 8923',
      departure: { time: '09:45', station: 'Paris Montparnasse' },
      arrival: { time: '11:58', station: 'Nantes' },
      duration: 133,
      price: 35,
    },
    {
      id: 'demo-t3',
      trainNumber: 'TGV 8925',
      departure: { time: '11:15', station: 'Paris Montparnasse' },
      arrival: { time: '13:28', station: 'Nantes' },
      duration: 133,
      price: 39,
    },
  ],
  successMessage: 'Réservé en 4 secondes !',
  bookingDuration: 4000,
};

// Scenario 4: Alerte Prix Intelligente
export const demoAlertePrix = {
  notification: {
    title: '💰 Alerte Velvet IA',
    body: 'ton Paris→Rennes vient de passer à 19€ (-47%)',
    price: 19,
    discount: 47,
    route: 'Paris → Rennes',
  },
  toastOnBook: 'Billet réservé à 19€ ✅',
};

// Scenario 5: Dernier Kilomètre
export const demoDernierKilometre = {
  arrival: {
    station: 'Bordeaux St-Jean',
    timeUntilArrival: '1h23',
  },
  options: [
    {
      id: 'bike',
      icon: '🚲',
      label: '3 vélos dispo',
      detail: 'à 200m',
      type: 'bike',
    },
    {
      id: 'bus',
      icon: '🚌',
      label: 'Bus 1',
      detail: 'dans 4 min',
      type: 'bus',
    },
    {
      id: 'uber',
      icon: '🚗',
      label: 'Uber',
      detail: '~8€',
      type: 'uber',
    },
  ],
};

// Demo toast messages
export const demoToasts = {
  demoStarted: '🎬 Mode démo activé',
  demoEnded: 'Démo terminée ! 🎉',
  scenarioPrefix: (current: number, total: number) => `Scénario ${current}/${total}`,
};
