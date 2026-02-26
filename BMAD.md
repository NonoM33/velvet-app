# BMAD — Velvet Companion 🚄✨
## Business Model Architecture Document

---

## 1. 🎯 Vision

**Velvet Companion** : le premier assistant de voyage IA pour le train à grande vitesse en France.

> "Pas une app de réservation. Un compagnon intelligent qui transforme chaque trajet en expérience."

**Pitch en 1 ligne :** L'app qui fait pour le train ce que Hopper fait pour l'avion — mais en mieux, avec de l'IA conversationnelle et du multimodal temps réel.

---

## 2. 🧩 Problèmes identifiés

| Problème | Impact | Solution Velvet |
|----------|--------|-----------------|
| SNCF Connect est l'app la + mal notée de France | Frustration massive des voyageurs | UX premium, fluide, plaisir d'utiliser |
| Aucun prix prédictif sur le train | Les gens achètent au mauvais moment | IA de prédiction de prix ("achète maintenant") |
| Perturbations = texte brut incompréhensible | Stress, correspondances ratées | Re-routing intelligent en temps réel avec alternatives multimodales |
| Zéro personnalisation | Chaque voyageur cherche from scratch | Profil IA qui apprend tes habitudes |
| Dernier km ignoré | "Et après la gare ?" | Multimodal intégré (vélo, bus, VTC) |

---

## 3. 👤 Personas

### 🧑‍💼 Thomas — Le navetteur Paris↔Bordeaux
- 32 ans, consultant, 2-3 trains/semaine
- **Pain:** Perd 20 min à chercher le meilleur horaire/prix
- **Want:** "Dis-moi juste quel train prendre et quand acheter"

### 👩‍🎓 Léa — L'étudiante Rennes↔Paris
- 22 ans, budget serré, voyage le week-end
- **Pain:** Veut le prix le plus bas, toujours
- **Want:** "Alerte-moi quand c'est pas cher"

### 👨‍👩‍👧 La famille Dupont — Vacances Atlantique
- Parents + 2 enfants, voyage 4-5x/an
- **Pain:** Réserver pour 4 = parcours du combattant
- **Want:** "Gère tout pour nous, on veut juste monter dans le train"

---

## 4. 🏗️ Architecture technique

```
┌─────────────────────────────────────────────────┐
│                 EXPO / REACT NATIVE              │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Chat UI  │ │ Journey  │ │  Price Alert     │ │
│  │ (LLM)    │ │ Planner  │ │  Dashboard       │ │
│  └────┬─────┘ └────┬─────┘ └────────┬─────────┘ │
│       │             │                │           │
│  ┌────┴─────────────┴────────────────┴─────────┐ │
│  │           State Management (Zustand)         │ │
│  └────────────────────┬────────────────────────┘ │
└───────────────────────┼──────────────────────────┘
                        │ REST / WebSocket
┌───────────────────────┼──────────────────────────┐
│                  BACKEND API                      │
│  ┌────────────┐ ┌────────────┐ ┌──────────────┐ │
│  │ LLM Agent  │ │ Price ML   │ │ Disruption   │ │
│  │ (HuggingFace│ │ Predictor  │ │ Router       │ │
│  │  Inference)│ │            │ │              │ │
│  └─────┬──────┘ └──────┬─────┘ └──────┬───────┘ │
│        │               │              │          │
│  ┌─────┴───────────────┴──────────────┴────────┐ │
│  │         External APIs Integration           │ │
│  │  • Navitia/SNCF API (horaires, temps réel)  │ │
│  │  • transport.data.gouv.fr (open data)       │ │
│  │  • Météo (OpenWeather)                      │ │
│  │  • Géolocalisation                          │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Stack

| Layer | Techno | Justification |
|-------|--------|---------------|
| **Mobile** | Expo SDK 52+ / React Native | Cross-platform, hot reload, OTA updates |
| **UI** | React Native Reanimated + Skia | Animations 60fps, effets visuels premium |
| **State** | Zustand + React Query | Léger, performant, cache intelligent |
| **Navigation** | Expo Router (file-based) | Convention over configuration |
| **LLM** | HuggingFace Inference API | Open source, contrôle total, coût maîtrisé |
| **Backend** | Node.js / Express ou Hono | Rapide, TS natif, WebSocket support |
| **ML** | Python (scikit-learn / Prophet) | Price prediction, affluence |
| **DB** | PostgreSQL + Redis | Données structurées + cache temps réel |
| **Real-time** | WebSocket + SSE | Perturbations live, chat streaming |

---

## 5. 📱 Features — MVP (Prototype)

### 5.1 🤖 Chat IA — "Velvet Assistant"
L'interface principale est un **chat conversationnel** (pas des formulaires).

```
User: "Je veux aller à Bordeaux samedi matin"

Velvet: "Voilà ce que j'ai trouvé pour samedi 🚄

 🟢 08h12 — Paris → Bordeaux — 2h04 — 29€
    Affluence faible 🟢 | 68% de chances que le prix baisse

 🟡 09h47 — Paris → Bordeaux — 2h11 — 45€  
    Affluence moyenne 🟡 | Prix stable

 💡 Mon conseil : attends lundi pour le 08h12,
    il descend souvent à 19€ en milieu de semaine.

 [Réserver] [Créer une alerte prix] [Voir plus]"
```

### 5.2 💰 Price Prediction
- Courbe de prix prédictive (comme Hopper)
- Notification "achète maintenant" vs "attends"
- Historique des prix sur le trajet

### 5.3 🚨 Smart Disruptions
- Alertes push intelligentes (pas du spam)
- Re-routing automatique avec alternatives
- ETA mise à jour en temps réel

### 5.4 🗺️ Journey Dashboard
- Vue timeline du voyage (avant → pendant → après)
- Météo à destination
- Dernier km : options depuis la gare d'arrivée

### 5.5 👤 Profil intelligent
- Trajets fréquents auto-détectés
- Préférences apprises (fenêtre, calme, 1ère classe...)
- Stats personnelles (€ économisés, CO2 évité)

---

## 6. 🎨 Design Direction

### Identité visuelle
- **Couleur primaire :** Violet profond (#6C3CE9) — premium, luxe, différenciant
- **Couleur secondaire :** Or chaud (#F5A623) — énergie, confiance
- **Accent :** Blanc pur + surfaces glassmorphism
- **Typo :** Inter (clean, moderne) ou SF Pro
- **Style :** Glassmorphism + gradients subtils + micro-animations

### Principes UI
1. **Dark mode first** — premium feel, se démarque de toutes les apps transport
2. **Cards flottantes** — glassmorphism avec blur
3. **Micro-animations partout** — Reanimated + Skia pour les transitions
4. **Chat-first** — L'IA est l'interface principale, pas des formulaires
5. **Data viz sexy** — Courbes de prix animées, gauges d'affluence
6. **Haptic feedback** — Vibrations subtiles sur les interactions

### Inspiration
- Arc Browser (glassmorphism, minimalisme)
- Revolut (data viz, premium feel)
- Raycast (chat IA intégré)
- Linear (animations, polish)

---

## 7. 📊 Business Model

### Pour Velvet (la compagnie)
- **Réservation directe** — Commission ou vente directe de billets Velvet
- **Data insights** — Analyse des patterns de voyage pour optimiser l'offre
- **Premium tier** — Features avancées (price alerts, priority re-routing)
- **Partenariats last-mile** — Intégration vélos/VTC avec commission

### Métriques clés
- DAU/MAU ratio (engagement)
- Taux de conversion recherche → réservation
- Accuracy du price predictor
- NPS (Net Promoter Score)
- Temps moyen pour réserver (cible: < 30 sec via chat)

---

## 8. 🗺️ Roadmap

### Phase 1 — Prototype (MAINTENANT)
- [ ] Chat IA fonctionnel (HuggingFace)
- [ ] Recherche de trajets (API Navitia)
- [ ] UI ultra premium (glassmorphism, animations)
- [ ] Price prediction mockée (data viz)
- [ ] Dashboard voyage

### Phase 2 — MVP (Mois 1-3)
- [ ] Backend complet + DB
- [ ] Vrai price prediction ML
- [ ] Perturbations temps réel
- [ ] Push notifications intelligentes
- [ ] Profil utilisateur + préférences

### Phase 3 — Scale (Mois 3-6)
- [ ] Multimodal (dernier km)
- [ ] Réclamation automatique
- [ ] Apple Watch companion
- [ ] Widget iOS/Android
- [ ] A/B testing UX

---

## 9. 🔑 Avantage compétitif

| vs | Notre avantage |
|----|----------------|
| SNCF Connect | UX 10x meilleure, IA native, pas de legacy |
| Trainline | Price prediction, conversationnel, brand Velvet |
| Google Maps | Spécialiste train, pas généraliste, features exclusives |
| Omio | IA conversationnelle, multimodal intelligent |

**Moat technique :** 
- Modèle ML de price prediction entraîné sur data propriétaire Velvet
- UX chat-first brevetable
- Intégration profonde avec les systèmes Velvet (réservation, temps réel)

---

## 10. 🛡️ Risques & Mitigations

| Risque | Mitigation |
|--------|-----------|
| API SNCF limitée/payante | Fallback transport.data.gouv.fr + scraping |
| LLM hallucinations | Guardrails stricts, données structurées only |
| Coût infra ML | HuggingFace Inference (gratuit/cheap) |
| Adoption | UX tellement supérieure que le bouche-à-oreille suffit |

---

*Document préparé pour la présentation R&D Velvet — Février 2026*

---

## 11. 🔌 MCP — Model Context Protocol pour le Transport Ferroviaire

### Le problème actuel
Les LLMs (ChatGPT, Mistral, Claude) n'ont **aucun accès structuré** aux données ferroviaires. Quand un utilisateur demande "Quel train pour Bordeaux samedi ?", le LLM doit :
1. Deviner quoi appeler
2. Formater un appel REST à la main
3. Parser une réponse JSON complexe
4. Espérer ne pas halluciner

→ Résultat : **lent, imprécis, fragile.**

### La solution : MCP Navitia
Un serveur **Model Context Protocol** (standard Anthropic) qui expose les données SNCF/Navitia comme des **outils typés** directement consommables par les LLMs.

```
┌─────────────────────────────────────────────────┐
│                    LLM (Mistral/Claude)          │
│  "Trouve-moi un train Paris→Bordeaux samedi"     │
└───────────────────────┬─────────────────────────┘
                        │ MCP Protocol
┌───────────────────────┴─────────────────────────┐
│              MCP Server Navitia                   │
│                                                   │
│  🔧 Tools disponibles :                          │
│  ├── search_trains(from, to, date, passengers)   │
│  ├── get_disruptions(line?, since?)              │
│  ├── get_departures(station, count?)             │
│  ├── get_station_info(query)                     │
│  ├── get_price_history(route, days)              │
│  ├── check_availability(train_id)                │
│  ├── get_weather_destination(city)               │
│  └── get_multimodal_options(station, destination)│
│                                                   │
│  📚 Resources :                                  │
│  ├── stations://sncf (liste des gares)           │
│  ├── routes://popular (trajets populaires)       │
│  └── disruptions://live (perturbations en cours) │
└───────────────────────┬─────────────────────────┘
                        │ REST APIs
         ┌──────────────┼──────────────┐
         │              │              │
    Navitia API    Open-Meteo    Transport.data
    (SNCF)         (Météo)       .gouv.fr
```

### Avantages

| Sans MCP | Avec MCP |
|----------|----------|
| LLM hallucine les horaires | Données temps réel vérifiées |
| Appels API ad-hoc et fragiles | Outils typés et documentés |
| Pas de contexte transport | Ressources riches (gares, lignes, tarifs) |
| Chaque app réinvente la roue | Standard réutilisable par tout agent IA |
| Clé API côté client (leak) | Clé côté serveur uniquement (sécurisé) |

### Stack technique
- **Runtime** : Node.js / TypeScript
- **Protocole** : MCP SDK (`@modelcontextprotocol/sdk`)
- **Transport** : stdio (local) ou SSE (remote)
- **APIs backend** : Navitia, Open-Meteo, transport.data.gouv.fr
- **Cache** : Redis (horaires rafraîchis toutes les 5 min)

### Pourquoi c'est un game-changer pour Velvet
1. **Première brique d'infrastructure IA** — pas juste une app, un **écosystème**
2. **Réutilisable** — le MCP peut alimenter l'app mobile, le chatbot web, le service client, les agents internes
3. **Scalable** — ajouter un nouveau tool = ajouter une fonction, pas refaire l'app
4. **Sécurisé** — les clés API restent côté serveur, jamais exposées au client
5. **Open standard** — MCP est le standard d'Anthropic, adopté par l'industrie

### Impact R&D
C'est **exactement** le type de livrables R&D qu'une compagnie comme Velvet cherche :
- Innovation technique démontrée
- Architecture pensée pour le scale
- Combinaison IA + transport = différenciation massive
- Propriété intellectuelle potentielle

