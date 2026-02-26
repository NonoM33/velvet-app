# 🔬 Analyse Stratégique — Velvet Companion
## Étude de marché, personas, problèmes concurrents & proposition de valeur IA

---

## 1. ANALYSE CONCURRENTIELLE

### SNCF Connect — Le géant détesté
- **Trustpilot : 1.3/5** (catastrophique)
- **App Store : 4.6/5** mais 1.8M d'avis = effet de volume + avis forcés
- **15M d'utilisateurs** = monopole, pas satisfaction

**Problèmes identifiés (extraits réels des avis) :**

| # | Problème | Fréquence | Gravité |
|---|----------|-----------|---------|
| 1 | **UX labyrinthique** — "3h pour acheter un billet, je suis ingénieur web" | ★★★★★ | Critique |
| 2 | **Retards non gérés** — "Retard 15min, correspondance ratée, aucune aide" | ★★★★★ | Critique |
| 3 | **Remboursements impossibles** — "Le formulaire ne fonctionne même pas" | ★★★★★ | Critique |
| 4 | **Info trafic incompréhensible** — Texte brut, pas de solution alternative | ★★★★☆ | Fort |
| 5 | **Multilingue désastreux** — "French only pour le support" | ★★★☆☆ | Moyen |
| 6 | **Pas de prix prédictif** — Aucune aide pour savoir quand acheter | ★★★★★ | Critique |
| 7 | **Pas de multimodal intelligent** — "Et après la gare ?" | ★★★★☆ | Fort |
| 8 | **Conducteurs/agents hostiles** — Problème humain, pas tech | ★★★☆☆ | Hors scope |

### Trainline — Le challenger correct
- **Trustpilot : 4.2/5** — bien meilleure réputation
- **Forces** : UX simple, split tickets UK, multi-opérateurs
- **Faiblesses** : 
  - Zéro IA/prédiction
  - Pas de gestion de perturbation
  - Commission cachée sur les billets
  - Pas de dernier km

### Omio / Google Maps — Les généralistes
- **Forces** : Multi-transport, couverture large
- **Faiblesses** :
  - Aucune personnalisation
  - Pas de réservation native (redirect)
  - Zéro intelligence prédictive

### Hopper (aérien) — Le modèle à suivre
- **Valorisation : $1B+**
- **Ce qu'ils font bien** : Prix prédictif, "achète/attends", alertes
- **Ce qui manque** : N'existe PAS pour le train. Personne ne l'a fait.

---

## 2. PERSONAS APPROFONDIS

### 🧑‍💼 PERSONA 1 — Thomas, 32 ans, Consultant en management

**Profil :**
- Paris ↔ Bordeaux 2-3x/semaine
- Dépense ~800€/mois en trains
- Abonné carte Liberté
- iPhone Pro, tech-savvy

**Journée type :**
- 6h30 : Regarde SNCF Connect pour son train de 7h → 4 taps pour trouver le quai
- 6h50 : Push notification "Votre train a 10 min de retard" → texte brut, aucune solution
- 7h15 : Train part avec 15 min de retard → correspondance menacée
- 9h30 : Arrivé avec 20 min de retard → pas de solution dernier km proposée
- 18h : Doit réserver son retour → cherche le meilleur prix, aucune aide

**Frustrations profondes :**
- "Je perds 20 min par jour à gérer mes trains"
- "Quand il y a un retard, je suis livré à moi-même"
- "Je ne sais jamais si le prix va baisser ou monter"
- "Après la gare, je galère toujours pour le dernier km"

**Ce que Velvet lui apporte :**
- ⏱️ **0 min de gestion** → L'IA réserve automatiquement son trajet habituel au meilleur prix
- 🚨 **Perturbation = solution** → "Retard 15min. Alternative trouvée : train de 7h23, même arrivée. [OK]"
- 💰 **800€ → 580€/mois** → La prédiction de prix lui fait économiser ~27%
- 🚲 **Dernier km résolu** → "Vélib station à 200m de la gare, 3 vélos dispos"

---

### 👩‍🎓 PERSONA 2 — Léa, 22 ans, Étudiante en design

**Profil :**
- Rennes ↔ Paris tous les vendredis soir
- Budget très serré : 50€ max par A/R
- Smartphone Android milieu de gamme
- Utilise Trainline + SNCF Connect pour comparer

**Frustrations profondes :**
- "Je passe 45 min chaque semaine à comparer les prix"
- "Parfois le train est complet et j'apprends trop tard"
- "Je rate souvent les promos car j'ai pas vu la notif"
- "L'app SNCF est une usine à gaz"

**Ce que Velvet lui apporte :**
- 🔔 **Alerte automatique** → "Ton Paris→Rennes vendredi est tombé à 19€ ! On réserve ?"
- 📊 **Prédiction visuelle** → Courbe de prix sur 2 semaines, point vert = meilleur moment
- ⚡ **1 tap pour réserver** → Pas de tunnel de paiement en 7 étapes
- 🎓 **Tarifs étudiants auto-appliqués** → Détecte sa carte Avantage Jeune

---

### 👨‍👩‍👧‍👦 PERSONA 3 — Marc & Sophie Dupont, 42/39 ans, Famille

**Profil :**
- 2 enfants (8 et 12 ans)
- Vacances Atlantique 4-5x/an (Paris → Nantes/La Rochelle)
- Dépensent ~2000€/an en trains
- Pas très tech, veulent que "ça marche"

**Frustrations profondes :**
- "Réserver pour 4 personnes c'est l'enfer — 47 clics minimum"
- "Les enfants veulent des sièges ensemble, impossible à garantir"
- "On ne sait jamais quelle voiture rejoindre avec les bagages"
- "Le remboursement quand un enfant est malade = parcours du combattant"

**Ce que Velvet lui apporte :**
- 👨‍👩‍👧‍👦 **Réservation famille en 1 tap** → "Vacances à Nantes comme d'habitude ? 4 places ensemble, voiture 8. [Réserver 116€]"
- 🧳 **Guide d'embarquement** → Plan du train, votre voiture, accès PMR, espace bagages
- 💬 **Langage naturel** → "On veut aller à Nantes le 15 août pour 2 adultes et 2 enfants" → résultat instantané
- 🔄 **Annulation simple** → "Annuler le voyage du 15 août" → remboursement auto en 48h

---

### 🧳 PERSONA 4 — James, 55 ans, Touriste britannique

**Profil :**
- Visite la France 2-3x/an
- Ne parle pas français
- Habitude : UK trains via Trainline
- Frustré par la barrière de la langue

**Frustrations profondes :**
- "SNCF support = French only, I can't communicate"
- "The machines at stations are confusing, I got fined"
- "I don't understand the announcements on the train"
- "I booked first class, they put me in second class, can't complain"

**Ce que Velvet lui apporte :**
- 🌍 **Full English** (+ 5 langues) — IA nativement multilingue
- 🎧 **Traduction live des annonces** → L'app écoute les annonces et traduit en temps réel
- 📱 **Billet QR universel** → Pas besoin de comprendre les machines
- 🆘 **Support IA 24/7** en sa langue → "My train was cancelled, what do I do?"

---

### 🏢 PERSONA 5 — Caroline, 45 ans, Travel Manager (entreprise)

**Profil :**
- Gère les déplacements de 200 consultants
- Budget transport : 500K€/an
- Utilise SAP Concur + SNCF Pro
- KPIs : coût moyen, empreinte carbone, compliance

**Frustrations profondes :**
- "Je n'ai aucune visibilité sur les dépenses en temps réel"
- "Les consultants réservent n'importe quand au prix fort"
- "Le reporting CO2 est manuel et approximatif"
- "Impossible de faire respecter la politique voyage"

**Ce que Velvet lui apporte :**
- 📊 **Dashboard temps réel** → Dépenses par équipe, par trajet, par mois
- 🤖 **Policy enforcement IA** → "Ce billet est 40% au-dessus de la politique voyage. Alternative à 35€ trouvée."
- 🌱 **Reporting CO2 automatique** → Tonnes évitées vs avion/voiture, certifié
- 💰 **Savings IA** → L'IA réserve au meilleur moment pour toute l'entreprise = 15-25% d'économies

---

## 3. LES 5 PROBLÈMES MAJEURS QUE VELVET RÉSOUT

### ❌ PROBLÈME 1 : "Je ne sais jamais quand acheter"
**Aujourd'hui :** Les voyageurs achètent au hasard. Aucune app ne dit si le prix va monter ou baisser.
**Hopper l'a prouvé pour l'avion** → $1B+ de valorisation. Personne ne l'a fait pour le train.

**🤖 Solution IA : Prix Prédictif**
- Modèle ML entraîné sur l'historique des prix SNCF/Velvet
- Analyse : jour de la semaine, saisonnalité, événements, météo, taux de remplissage
- Output : "Achète maintenant (94% de confiance)" ou "Attends mardi (-23% prédit)"
- **Impact mesurable : 15-30% d'économies par voyageur**

### ❌ PROBLÈME 2 : "En cas de retard, je suis seul"
**Aujourd'hui :** Push notification "Retard 15 min". Point. Aucune solution.

**🤖 Solution IA : Re-routing Intelligent**
- Détecte le retard en temps réel (API Navitia)
- Analyse les correspondances impactées
- Calcule les alternatives (autre train, bus, VTC, vélo)
- Propose la meilleure solution : "Train suivant dans 8min, arrivée 5min de retard seulement. [Changer]"
- **Exécute le changement en 1 tap** — pas de file au guichet

### ❌ PROBLÈME 3 : "Réserver est un calvaire"
**Aujourd'hui :** 7-12 étapes pour acheter un billet sur SNCF Connect. Formulaires, dates, heures, classe, carte de réduction, paiement...

**🤖 Solution IA : Réservation Conversationnelle**
- "Paris Bordeaux samedi matin" → 3 résultats en 2 secondes
- 1 tap pour réserver (profil pré-rempli, carte enregistrée)
- L'IA apprend tes préférences : fenêtre, wagon calme, 2nde classe
- **Temps de réservation : de 4 min à 15 secondes**

### ❌ PROBLÈME 4 : "Et après la gare ?"
**Aujourd'hui :** L'app SNCF te dépose à la gare. Débrouille-toi pour le dernier kilomètre.

**🤖 Solution IA : Multimodal End-to-End**
- Avant l'arrivée : "Tu arrives Gare St-Jean dans 15min. Options pour Mériadeck :"
  - 🚲 Vélib : 3 vélos à 200m (8 min, gratuit)
  - 🚌 Bus 1 : arrêt devant la gare (12 min, 1.70€)
  - 🚗 Uber : 7 min, ~8€
- Intégration temps réel des APIs de mobilité locales
- **Le voyage ne s'arrête pas à la gare**

### ❌ PROBLÈME 5 : "Les réclamations sont impossibles"
**Aujourd'hui :** Retard > 30 min = droit au remboursement. Mais le formulaire SNCF ne fonctionne pas (confirmé par les avis Trustpilot).

**🤖 Solution IA : Réclamation Automatique**
- Détecte automatiquement les retards éligibles
- Pré-remplit la demande de compensation
- L'envoie automatiquement (ou en 1 tap)
- Suit le dossier et relance si pas de réponse
- **Le voyageur récupère son dû sans lever le petit doigt**

---

## 4. MATRICE FONCTIONNELLE — QUI FAIT QUOI

| Feature | SNCF Connect | Trainline | Omio | Google Maps | **Velvet** |
|---------|:---:|:---:|:---:|:---:|:---:|
| Réservation train | ✅ | ✅ | ✅ | ❌ (redirect) | ✅ |
| Prix prédictif IA | ❌ | ❌ | ❌ | ❌ | **✅ 🔥** |
| Re-routing perturbation | ❌ (notif brute) | ❌ | ❌ | ❌ | **✅ 🔥** |
| Réservation en 1 phrase | ❌ | ❌ | ❌ | ❌ | **✅ 🔥** |
| Multimodal dernier km | ❌ | ❌ | Partiel | ✅ (pas de booking) | **✅ 🔥** |
| Réclamation auto | ❌ | ❌ | ❌ | ❌ | **✅ 🔥** |
| Traduction live annonces | ❌ | ❌ | ❌ | ❌ | **✅ 🔥** |
| Profil IA adaptatif | ❌ | ❌ | ❌ | ❌ | **✅ 🔥** |
| Dashboard entreprise | Basique | ❌ | ❌ | ❌ | **✅ 🔥** |
| Info temps réel | ✅ | ✅ | Partiel | ✅ | ✅ |
| Multi-opérateurs | ✅ | ✅ | ✅ | ✅ | Phase 2 |

**Velvet est le seul à proposer de l'IA native dans le transport ferroviaire.**

---

## 5. IMPACT BUSINESS ESTIMÉ

| Métrique | Objectif Année 1 | Source de revenus |
|----------|-------------------|-------------------|
| Utilisateurs | 500K | Marketing Velvet |
| Taux de conversion | 12% (vs 3% SNCF) | UX 10x + IA |
| Panier moyen | 45€ | Prix prédictif pousse l'achat |
| Économies voyageur | 15-30% | Fidélisation massive |
| NPS | > 60 (vs -20 SNCF) | Bouche-à-oreille |
| Coût support | -40% | IA self-service |
| Revenue B2B | 2M€ | Dashboard entreprise |

---

## 6. CONCLUSION

### Le marché est MÛR pour une disruption

- SNCF Connect est **universellement détestée** (1.3/5 Trustpilot)
- **Personne** ne fait de prix prédictif sur le train
- **Personne** ne gère les perturbations intelligemment
- **Personne** ne propose de réservation conversationnelle
- Le modèle Hopper a **prouvé** que le prix prédictif vaut des milliards

### Velvet a une opportunité unique

En tant que **nouvelle compagnie sans legacy**, Velvet peut construire l'app que tout le monde attend. Pas une app de réservation de plus — un **compagnon de voyage intelligent** qui :

1. **Fait économiser de l'argent** (prix prédictif)
2. **Fait gagner du temps** (réservation en 15 sec)
3. **Résout les problèmes** (perturbations, dernier km, réclamations)
4. **Apprend et s'adapte** (profil IA)

> *"L'app qui fait pour le train ce que Hopper fait pour l'avion — mais en 10x mieux."*

---

*Document préparé pour la discussion R&D Velvet — Février 2026*
*Analyse basée sur données réelles (Trustpilot, App Store, transport.data.gouv.fr)*
