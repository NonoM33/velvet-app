<p align="center">
  <img src="assets/icon.png" width="80" height="80" alt="Velvet Logo" />
</p>

<h1 align="center">Velvet</h1>

<p align="center">
  <strong>L'expérience premium du voyage en train</strong>
  <br />
  <em>Compagnie TGV indépendante · Lancement 2028</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-55-4630EB?style=flat-square&logo=expo&logoColor=white" alt="Expo 55" />
  <img src="https://img.shields.io/badge/React_Native-0.83-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-8B5CF6?style=flat-square" alt="Platform" />
  <img src="https://img.shields.io/badge/License-Proprietary-1E1B4B?style=flat-square" alt="License" />
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#design-system">Design System</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#api-integration">APIs</a> ·
  <a href="#deployment">Deployment</a>
</p>

---

## Preview

> **Prototype live :** [velvet.157.180.43.90.sslip.io](http://velvet.157.180.43.90.sslip.io)

<!--
<p align="center">
  <img src="docs/screenshots/home.png" width="250" />
  <img src="docs/screenshots/search.png" width="250" />
  <img src="docs/screenshots/booking.png" width="250" />
</p>
-->

---

## Features

| Feature | Description |
|---------|-------------|
| 🔍 **Smart Search** | Recherche de trajets avec suggestions intelligentes et historique |
| 🤖 **IA Prédictive** | Prédiction de prix, score IA par trajet, alertes prix optimal |
| ⚡ **Temps réel** | Perturbations, retards, alternatives automatiques |
| 🎫 **Booking Flow** | Réservation fluide en 3 étapes avec confirmation animée |
| 💬 **Chat IA** | Assistant voyage conversationnel (HuggingFace) |
| 📊 **Price Charts** | Historique de prix et tendances sur 12 jours |
| 🔔 **Alertes** | Surveillance de routes avec notifications prix |
| 👤 **Profil** | Fidélité, préférences, historique voyages |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | [Expo](https://expo.dev) | 55 |
| **UI** | [React Native](https://reactnative.dev) | 0.83 |
| **Navigation** | [Expo Router](https://docs.expo.dev/router) | 55 |
| **Animations** | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | 4.2 |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) | 5.0 |
| **Language** | TypeScript | 5.x |
| **Blur/Effects** | expo-blur, expo-linear-gradient, expo-haptics | — |
| **Gestures** | react-native-gesture-handler | 2.30 |
| **Deploy** | Docker + Coolify | — |

---

## 📐 Design System & UX/UI

> Inspiré par **Apple Human Interface Guidelines** et **Material Design 3**.
> Chaque décision de design vise le niveau de qualité des apps Google & Apple first-party.

### Color Palette

Palette sophistiquée centrée sur un violet profond, remplaçant le rose initial pour un rendu premium :

| Role | Swatch | Hex | Usage |
|------|--------|-----|-------|
| **Primary** | 🟣 | `#8B5CF6` | Actions principales, CTA, éléments interactifs |
| **Primary Light** | 🟣 | `#A78BFA` | Hover states, accents secondaires |
| **Primary Dark** | 🟣 | `#7C3AED` | Pressed states, gradients |
| **Primary Muted** | ⚪ | `#DDD6FE` | Backgrounds légers, badges |
| **Navy** | 🔵 | `#1E1B4B` | Headings, texte premium |
| **Success** | 🟢 | `#059669` | Prix excellent, confirmations |
| **Warning** | 🟡 | `#D97706` | Occupancy moyenne, alertes |
| **Error** | 🔴 | `#DC2626` | Erreurs, prix élevé |
| **Info** | 🔵 | `#2563EB` | Informations, liens |

**Neutral scale** : 10 niveaux de gris chauds (`neutral50` → `neutral900`) pour textes, borders et backgrounds.

**AI-specific** : Gradient violet `#8B5CF6` → `#7C3AED` avec glow effect pour signaler les fonctionnalités IA.

### Typography Scale

Échelle typographique conforme aux Apple HIG (base 17pt) avec letter-spacing et line-heights précis :

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display` | 40px | 700 | 48px | -0.5 | Hero titles |
| `h1` | 32px | 700 | 40px | -0.3 | Section headers |
| `h2` | 24px | 600 | 32px | -0.2 | Card titles |
| `h3` | 20px | 600 | 28px | -0.1 | Subsection titles |
| `h4` | 17px | 600 | 24px | 0 | List headers |
| `body` | 17px | 400 | 24px | 0 | Default body text |
| `callout` | 16px | 400 | 22px | 0 | Secondary body |
| `subhead` | 15px | 400 | 20px | 0 | Supporting text |
| `caption` | 13px | 400 | 18px | 0 | Labels, timestamps |
| `footnote` | 12px | 400 | 16px | 0 | Fine print |
| `small` | 11px | 400 | 14px | 0.1 | Badges, tags |
| `micro` | 10px | 500 | 12px | 0.2 | Tiny labels |

Chaque style dispose de variantes `medium`, `semibold`, et `bold`.

### Spacing System

Grille **8pt stricte** avec demi-unités pour les ajustements fins :

```
xxs:  2px  │  0.25× base
xs:   4px  │  0.5×  base
sm:   8px  │  1×    base  ← unit
smd: 12px  │  1.5×  base
md:  16px  │  2×    base
lg:  24px  │  3×    base
xl:  32px  │  4×    base
xxl: 48px  │  6×    base
xxxl:64px  │  8×    base
```

**Layout constants** : `screenPadding: 16`, `cardPadding: 16`, `sectionSpacing: 24`, `maxContentWidth: 600`.

### Elevation & Shadows

Système d'élévation Material Design 3 avec 6 niveaux :

| Level | Name | Blur | Opacity | Usage |
|-------|------|------|---------|-------|
| 0 | `none` | 0 | 0 | Flat elements |
| 1 | `sm` | 3px | 0.04 | Cards, list items |
| 2 | `md` | 8px | 0.06 | Elevated cards |
| 3 | `lg` | 16px | 0.08 | Modals, popovers |
| 4 | `xl` | 24px | 0.10 | Bottom sheets, dialogs |
| ✨ | `glow` | 16px | 0.25 | AI elements (violet glow) |
| 💚 | `glowSuccess` | 12px | 0.25 | Success feedback (emerald) |

Shadow color : `#1E1B4B` (navy) pour une cohérence tonale avec la palette.

### Motion & Animations

Animations physiques (spring-based) conformes aux Apple HIG :

| Spring Config | Damping | Stiffness | Mass | Usage |
|---------------|---------|-----------|------|-------|
| `default` | 20 | 300 | 1.0 | Standard transitions |
| `gentle` | 25 | 200 | 1.0 | Subtle feedback |
| `snappy` | 15 | 400 | 0.8 | Quick responses |
| `bouncy` | 10 | 350 | 1.0 | Playful elements |
| `stiff` | 30 | 500 | 1.0 | Minimal overshoot |

**Timing durations** : `instant: 100ms`, `fast: 150ms`, `normal: 250ms`, `slow: 350ms`, `slower: 500ms`

**Stagger delays** pour les listes : `fast: 30ms`, `normal: 50ms`, `slow: 80ms`

**Easing curves** (MD3) : standard `[0.2, 0, 0, 1]`, entrance `[0, 0, 0.2, 1]`, exit `[0.2, 0, 1, 1]`

#### Principes d'animation

1. **Meaningful motion** — Chaque animation a un but (feedback, continuité spatiale, focus)
2. **Spring physics** — Pas de timing linéaire, les springs créent un mouvement naturel
3. **Staggered entry** — Les listes apparaissent en cascade (FadeInDown + delay séquentiel)
4. **Skeleton loading** — Shimmer effect au lieu de spinners pour réduire la perception d'attente
5. **Haptic feedback** — `expo-haptics` pour confirmer les actions (légères pour les taps, moyennes pour les succès)

### Component Library

#### UI Primitives (`src/components/ui/`)

| Component | Variants | Description |
|-----------|----------|-------------|
| **Button** | `primary`, `secondary`, `outline`, `ghost`, `danger`, `success` × 3 tailles | CTA avec animations press, support icônes |
| **IconButton** | — | Bouton icône circulaire, touch target 44pt |
| **Input** | `default`, `search`, `outlined` | Focus animé, validation visuelle, icônes |
| **SearchInput** | — | Input de recherche avec icône et clear button |
| **Card** | `default`, `elevated`, `outlined`, `filled`, `ai`, `interactive` | Container avec variante AI (gradient border) |
| **ListCard** | — | Card optimisée pour les listes avec chevron |
| **SectionCard** | — | Container de section avec titre et description |
| **Chip** | `default`, `selected`, `outlined` | Filter chips, tags sélectionnables |
| **Badge** | `default`, `success`, `warning`, `error`, `info`, `ai` | Status indicators |
| **LiveBadge** | — | Badge avec PulsingDot pour le temps réel |
| **Skeleton** | — | Shimmer loader configurable |
| **SkeletonText** | — | Placeholder texte multiligne |
| **SkeletonAvatar** | — | Placeholder circulaire |
| **SkeletonCard** | — | Placeholder carte complète |
| **SkeletonTrainCard** | — | Preset skeleton pour TrainCard |

#### Animation Primitives (`src/components/ui/Animations.tsx`)

| Component | Description |
|-----------|-------------|
| **PulsingDot** | Point clignotant (live indicators) |
| **Sparkle** | Étoile animée (éléments IA) |
| **Shimmer** | Effet shimmer pour skeleton loading |
| **BounceIn** | Wrapper d'animation d'entrée rebondissante |
| **SlideIn** | Wrapper slide directionnel (left/right/up/down) |
| **TypingIndicator** | 3 dots animés (chat) |
| **ProgressBar** | Barre de progression animée avec gradient |
| **Spinner** | Loading spinner violet |

#### Domain Components

**Home** (`src/components/home/`) :
- `SmartSearchSection` — Recherche collapsible avec suggestions et destinations populaires
- `PricePredictionCard` — Hero card IA avec chart de prix animé
- `DisruptionCard` — Alertes temps réel avec alternatives IA
- `NextTripCard` — Carte voyage expandable avec countdown
- `InsightCard` — Insights IA en pills horizontales scrollables
- `StatsRow` — Compteurs animés (économies, trajets, score fidélité)

**Shared** (`src/components/`) :
- `TrainCard` — Carte trajet avec score IA, occupancy, prix
- `TabBar` — Tab bar custom avec blur iOS et indicateur animé
- `GlassCard` — Card glassmorphism avec blur
- `BookingModal` — Modal de réservation full-screen
- `ChatBubble` — Bulles de chat stylisées
- `PriceChart` — Graphique de prix interactif
- `AnimatedCounter` — Compteur numérique animé
- `OccupancyGauge` — Jauge d'occupation visuelle

### Touch Targets

Conformité stricte Apple HIG :

| Size | Value | Usage |
|------|-------|-------|
| `minimum` | 44pt | Cible tactile minimale absolue |
| `comfortable` | 48pt | Boutons standards |
| `large` | 56pt | CTA principaux, tab bar |

### Accessibility

- Contraste texte ≥ 4.5:1 (WCAG AA) grâce aux couleurs `neutral900` sur fond blanc
- Touch targets 44pt minimum sur tous les éléments interactifs
- Labels accessibles sur les icônes et boutons
- Hierarchie visuelle claire (taille + poids + couleur)
- Support du mode sombre prévu (tokens `surface`, `background` prêts)

### Inspirations & Références

| Source | Ce qu'on en retient |
|--------|-------------------|
| **Apple HIG** | Typography 17pt base, spring physics, haptics, safe areas |
| **Material Design 3** | Elevation system, color tokens, motion curves |
| **Trainline** | Hero search, price clarity, minimal booking flow |
| **SNCF Connect** | Real-time disruptions, alternative suggestions |
| **Omio** | Multi-modal comparison, clean results layout |
| **Uber** | Skeleton loading, map integration, micro-interactions |

---

## Getting Started

### Prérequis

- Node.js ≥ 18
- npm ou yarn
- Expo CLI (`npx expo`)

### Installation

```bash
git clone https://github.com/NonoM33/velvet-app.git
cd velvet-app
npm install
```

### Lancement

```bash
# Web (development)
npx expo start --web

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android
```

### Build Web (production)

```bash
npx expo export --platform web
# Output dans dist/
```

---

## Project Structure

```
velvet-app/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout (fonts, providers)
│   ├── onboarding.tsx           # Onboarding flow
│   ├── (tabs)/                  # Tab navigator
│   │   ├── _layout.tsx          # Tab config + custom TabBar
│   │   ├── index.tsx            # 🏠 Home (search, insights, trips)
│   │   ├── trips.tsx            # 🎫 My trips
│   │   ├── chat.tsx             # 💬 AI Chat assistant
│   │   └── profile.tsx          # 👤 Profile & settings
│   └── journey/
│       ├── search-results.tsx   # 🔍 Search results + filters
│       └── [id].tsx             # 📋 Journey detail + booking
│
├── src/
│   ├── constants/
│   │   └── theme.ts             # 🎨 Design System v2.0
│   │
│   ├── components/
│   │   ├── ui/                  # Primitives (Button, Card, Input, Chip, Skeleton, Animations)
│   │   ├── home/                # Home-specific (SmartSearch, PricePredict, Disruptions...)
│   │   ├── TrainCard.tsx        # Train result card
│   │   ├── TabBar.tsx           # Custom tab bar
│   │   ├── BookingModal.tsx     # Booking flow modal
│   │   ├── ChatBubble.tsx       # Chat message bubble
│   │   └── ...                  # GlassCard, PriceChart, Toast, etc.
│   │
│   ├── services/
│   │   ├── navitia.ts           # 🚄 SNCF Navitia API
│   │   ├── weather.ts           # ☀️ Open-Meteo API
│   │   ├── huggingface.ts       # 🤖 HuggingFace AI API
│   │   ├── types.ts             # Shared TypeScript types
│   │   ├── mockData.ts          # Demo data
│   │   └── demoData.ts          # Demo scenarios
│   │
│   ├── store/
│   │   └── store.ts             # Zustand global state
│   │
│   ├── hooks/                   # Custom React hooks
│   └── utils/                   # Utility functions
│
├── assets/                      # Images, fonts, icons
├── Dockerfile                   # Production Docker build
├── nginx.conf                   # Nginx config for web
└── package.json
```

---

## Architecture

### State Management

**Zustand** store minimaliste avec :
- `searchState` — Requêtes de recherche et résultats
- `bookingState` — Flow de réservation en cours
- `userState` — Profil, préférences, fidélité
- `uiState` — Modals, toasts, mode démo

### Navigation

**Expo Router** (file-based routing) :
- Tab navigation pour les 4 onglets principaux
- Stack navigation pour le flow de recherche/booking
- Deep linking ready

### Component Pattern

```
Screen (page)
  └── Section (domain component)
       └── UI Primitive (Button, Card, Input...)
            └── Design Token (Colors, Spacing, Typography...)
```

Chaque composant < 300 lignes. Logique métier dans les services, état dans le store.

---

## API Integration

### 🚄 Navitia (SNCF Open Data)

Recherche de trajets, départs temps réel, perturbations.

```typescript
import { searchTrainsByCity, getDepartures, getDisruptions } from '@/services/navitia';
```

### ☀️ Open-Meteo

Météo destination pour les suggestions et l'affichage trajet.

```typescript
import { getWeatherCached } from '@/services/weather';
```

### 🤖 HuggingFace

Chat IA conversationnel pour l'assistant voyage. Proxy nginx pour CORS en web.

```typescript
import { chat } from '@/services/huggingface';
```

> **Note :** Les clés API sont en variables d'environnement. Voir `.env.example`.

---

## Deployment

### Docker + Coolify

L'app web est déployée via Docker sur Coolify :

```bash
# Build
docker build -t velvet-app .

# Run
docker run -p 3000:80 velvet-app
```

**Coolify UUID** : `s84wssc4kwgk0k4s40cgk84w`

Le `Dockerfile` fait un `npx expo export --platform web` puis sert les fichiers statiques via nginx.

Le `nginx.conf` inclut un proxy `/api/hf/` vers l'API HuggingFace pour contourner les restrictions CORS.

---

## Contributing

1. Fork le repo
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit tes changements (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Conventions

- **Commits** : [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `docs:`)
- **Components** : PascalCase, un composant par fichier, < 300 lignes
- **Styles** : StyleSheet en bas du fichier, tokens du design system uniquement
- **Types** : TypeScript strict, pas de `any`

---

## License

Proprietary — © 2025-2026 Velvet SAS. All rights reserved.

---

<p align="center">
  <strong>Velvet</strong> — Le train, réinventé.
  <br />
  <sub>Built with ❤️ and a lot of ☕</sub>
</p>
