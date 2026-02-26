# Onboarding Spec — Velvet Companion

## 3-4 écrans swipables au premier lancement

### Écran 1 — "Le voyage réinventé par l'IA"
- Grand titre animé (fade in lettre par lettre)
- Illustration : icône train + sparkles IA
- Sous-titre : "Velvet Companion utilise l'intelligence artificielle pour transformer chaque trajet"
- Background : gradient subtil blanc → rose pâle (#FFF → #FDF0FF)

### Écran 2 — "Achetez au meilleur moment"  
- Animation : courbe de prix qui descend avec un point vert "Meilleur moment"
- Chiffre animé : "-34% en moyenne grâce à l'IA"
- Texte : "Notre IA prédit les prix et vous dit quand acheter"

### Écran 3 — "Perturbation ? On gère."
- Animation : notification de retard qui slide → immédiatement suivie d'une solution IA
- Texte : "En cas de retard, l'IA trouve une alternative en 2 secondes"

### Écran 4 — "Votre assistant personnel"
- Animation : bulle de chat avec réponse IA
- Texte : "Parlez naturellement. L'IA comprend et réserve pour vous."
- Gros bouton CTA : "Commencer l'aventure 🚄" (pink/violet, full width)

## Design
- Pagination dots en bas (pink active, gris inactive)
- Swipe horizontal ou bouton "Suivant"
- Skip button discret en haut à droite
- Animations Reanimated sur chaque écran (spring, fade, slide)
- Sauvegarder dans AsyncStorage qu'on a vu l'onboarding
