import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  RefreshControl,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  FadeInUp,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
  SlideInRight,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard, AnimatedCounter, BookingModal, showToast } from '../../src/components';
import { useStore } from '../../src/store/store';
import { formatTime, formatDate, getCountdown, searchTrainsByCity, getDepartures, getDisruptions, Departure, Disruption as NavitiaDisruption } from '../../src/services/navitia';
import { parisBordeauxTrains, parisNantesTrains, weatherData as mockWeatherData } from '../../src/services/mockData';
import { getWeatherCached, getFallbackWeather } from '../../src/services/weather';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/constants/theme';
import { Train, Weather } from '../../src/services/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Animated price chart data (12 days history)
const priceData = [45, 52, 48, 39, 35, 29, 32, 28, 25, 31, 27, 24];

// Saved routes for price prediction
const savedRoutes = [
  { origin: 'Paris', destination: 'Bordeaux', price: 24, originalPrice: 39, confidence: 94, daysUntilRise: 3 },
  { origin: 'Paris', destination: 'Nantes', price: 19, originalPrice: 35, confidence: 91, daysUntilRise: 2 },
];

// Disruption data
const disruptions = [
  {
    id: 'd1',
    route: 'Paris → Nantes',
    trainNumber: 'TGV 8751',
    delay: 15,
    alternativeTrain: 'TGV 8753',
    alternativeTime: '10h23',
    priceDiff: 5,
    sameArrival: true,
  },
  {
    id: 'd2',
    route: 'Lyon → Paris',
    trainNumber: 'TGV 6201',
    delay: 25,
    alternativeTrain: 'TGV 6205',
    alternativeTime: '11h45',
    priceDiff: 0,
    sameArrival: false,
  },
];

// AI insights
const aiInsights = [
  { id: 'i1', text: 'Mardi = jour le moins cher', detail: '-23% en moyenne', icon: 'calendar', cta: 'Voir les mardis' },
  { id: 'i2', text: 'Paris→Bordeaux', detail: '-15% ce mois-ci', icon: 'trending-down', cta: 'Réserver' },
  { id: 'i3', text: 'Nouveau: Direct Rennes', detail: '6h45, 19€', icon: 'flash', cta: 'Découvrir' },
  { id: 'i4', text: 'Alerte prix active', detail: '2 routes surveillées', icon: 'notifications', cta: 'Gérer' },
];

export default function HomeScreen() {
  const { user, upcomingTrips } = useStore();
  const nextTrip = upcomingTrips[0];

  // Search state
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [fromCity, setFromCity] = useState('Paris');
  const [toCity, setToCity] = useState('');
  const [searchResults, setSearchResults] = useState<Train[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Booking modal state
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);

  // Next trip expanded state
  const [tripExpanded, setTripExpanded] = useState(false);

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Real-time data state
  const [liveDisruptions, setLiveDisruptions] = useState<NavitiaDisruption[]>([]);
  const [liveDepartures, setLiveDepartures] = useState<Departure[]>([]);
  const [liveWeather, setLiveWeather] = useState<Weather | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Active route for price prediction
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const activeRoute = savedRoutes[activeRouteIndex];

  // Fetch live data on mount
  const fetchLiveData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // Fetch disruptions
      const disruptions = await getDisruptions();
      setLiveDisruptions(disruptions);

      // Fetch departures from Paris Montparnasse
      const departures = await getDepartures('paris', 5);
      setLiveDepartures(departures);

      // Fetch weather for destination
      const weatherCity = nextTrip?.train?.arrival?.station?.city || 'Bordeaux';
      const weather = await getWeatherCached(weatherCity);
      setLiveWeather(weather || getFallbackWeather(weatherCity));
    } catch (error) {
      console.error('Error fetching live data:', error);
      setLiveWeather(getFallbackWeather('bordeaux'));
    } finally {
      setIsLoadingData(false);
    }
  }, [nextTrip]);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const handleSearch = useCallback(() => {
    if (!toCity.trim()) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const results = searchTrainsByCity(fromCity, toCity);
    setSearchResults(results);
    setShowResults(true);
  }, [fromCity, toCity]);

  const handleBookTrain = useCallback((train: Train) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedTrain(train);
    setBookingModalVisible(true);
  }, []);

  const handleCreateAlert = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    showToast('Alerte créée ✅', 'success');
  }, []);

  const handleSwapBooking = useCallback((disruptionId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    showToast('Billet modifié ✅', 'success');
  }, []);

  const handleInsightAction = useCallback((insightId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    showToast('Action effectuée!', 'info');
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await fetchLiveData();
    setRefreshing(false);
    showToast('Données mises à jour', 'success');
  }, [fetchLiveData]);

  const countdown = nextTrip?.train?.departure?.time ? getCountdown(nextTrip.train.departure.time) : null;
  const destinationCity = nextTrip?.train?.arrival?.station?.city?.toLowerCase() ?? '';
  // Use live weather data if available, otherwise fall back to mock data
  const destinationWeather = liveWeather || (destinationCity ? (mockWeatherData[destinationCity] ?? null) : null);

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()} {user.name} 👋
              </Text>
              <Text style={styles.subtitle}>Votre dashboard temps réel</Text>
            </View>
          </Animated.View>

          {/* SECTION 1: Smart Search */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <SmartSearchSection
              expanded={searchExpanded}
              onToggleExpanded={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setSearchExpanded(!searchExpanded);
                if (searchExpanded) {
                  setShowResults(false);
                }
              }}
              fromCity={fromCity}
              toCity={toCity}
              onFromChange={setFromCity}
              onToChange={setToCity}
              onSearch={handleSearch}
              results={searchResults}
              showResults={showResults}
              onBookTrain={handleBookTrain}
            />
          </Animated.View>

          {/* SECTION 2: Prix Prédictif IA - HERO CARD */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.sectionTitle}>Prix Prédictif IA</Text>
            <PricePredictionCard
              route={activeRoute}
              priceData={priceData}
              onBook={() => {
                const train = parisBordeauxTrains.find(t => t.priceRecommendation === 'buy_now') || parisBordeauxTrains[0];
                handleBookTrain(train);
              }}
              onCreateAlert={handleCreateAlert}
              onChangeRoute={() => {
                setActiveRouteIndex((activeRouteIndex + 1) % savedRoutes.length);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            />
          </Animated.View>

          {/* SECTION 3: Perturbations Live */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Perturbations Live</Text>
              <View style={styles.liveBadge}>
                <PulsingDot color={liveDisruptions.length > 0 ? Colors.error : Colors.success} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            {liveDisruptions.length > 0 ? (
              liveDisruptions.slice(0, 3).map((disruption, index) => (
                <LiveDisruptionCard
                  key={disruption.id}
                  disruption={disruption}
                  delay={index * 100}
                />
              ))
            ) : isLoadingData ? (
              <GlassCard variant="default" animated={false} style={styles.disruptionCardContainer}>
                <View style={styles.noDisruptionsCard}>
                  <Ionicons name="refresh" size={20} color={Colors.textMuted} />
                  <Text style={styles.noDisruptionsText}>Chargement des perturbations...</Text>
                </View>
              </GlassCard>
            ) : (
              <GlassCard variant="default" animated={false} style={styles.disruptionCardContainer}>
                <View style={styles.noDisruptionsCard}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                  <Text style={styles.noDisruptionsText}>Aucune perturbation en cours ✅</Text>
                  <Text style={styles.noDisruptionsSubtext}>Trafic normal sur toutes les lignes</Text>
                </View>
              </GlassCard>
            )}
          </Animated.View>

          {/* SECTION 4: Mon Prochain Voyage */}
          {nextTrip && (
            <Animated.View entering={FadeInDown.delay(400).duration(400)}>
              <Text style={styles.sectionTitle}>Mon Prochain Voyage</Text>
              <NextTripCard
                trip={nextTrip}
                countdown={countdown}
                weather={destinationWeather}
                expanded={tripExpanded}
                onToggleExpanded={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setTripExpanded(!tripExpanded);
                }}
              />
            </Animated.View>
          )}

          {/* SECTION 5: IA Insights */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <Text style={styles.sectionTitle}>IA Insights</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.insightsContainer}
            >
              {aiInsights.map((insight, index) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  delay={index * 50}
                  onAction={() => handleInsightAction(insight.id)}
                />
              ))}
            </ScrollView>
          </Animated.View>

          {/* Stats Row */}
          <Animated.View entering={FadeInDown.delay(600).duration(400)}>
            <Text style={styles.sectionTitle}>Économies grâce à l'IA</Text>
            <View style={styles.statsRow}>
              <GlassCard style={styles.statCard} variant="flat" delay={0}>
                <View style={styles.statContent}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="cash" size={20} color={Colors.success} />
                  </View>
                  <AnimatedCounter value={user.stats.moneySaved} suffix="€" style={styles.statValue} />
                  <Text style={styles.statLabel}>Économisés</Text>
                </View>
              </GlassCard>
              <GlassCard style={styles.statCard} variant="flat" delay={100}>
                <View style={styles.statContent}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="train" size={20} color={Colors.primary} />
                  </View>
                  <AnimatedCounter value={user.stats.totalTrips} style={styles.statValue} />
                  <Text style={styles.statLabel}>Voyages</Text>
                </View>
              </GlassCard>
              <GlassCard style={styles.statCard} variant="flat" delay={200}>
                <View style={styles.statContent}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name="leaf" size={20} color={Colors.success} />
                  </View>
                  <AnimatedCounter value={user.stats.co2Avoided} suffix="kg" style={styles.statValue} />
                  <Text style={styles.statLabel}>CO₂ évité</Text>
                </View>
              </GlassCard>
            </View>
          </Animated.View>

          {/* Bottom spacing for tab bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      {/* Booking Modal */}
      <BookingModal
        visible={bookingModalVisible}
        train={selectedTrain}
        onClose={() => setBookingModalVisible(false)}
        onConfirm={(train) => {
          console.log('Booked train:', train.trainNumber);
        }}
      />
    </LinearGradient>
  );
}

// ============= SMART SEARCH SECTION =============
interface SmartSearchProps {
  expanded: boolean;
  onToggleExpanded: () => void;
  fromCity: string;
  toCity: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onSearch: () => void;
  results: Train[];
  showResults: boolean;
  onBookTrain: (train: Train) => void;
}

function SmartSearchSection({
  expanded,
  onToggleExpanded,
  fromCity,
  toCity,
  onFromChange,
  onToChange,
  onSearch,
  results,
  showResults,
  onBookTrain,
}: SmartSearchProps) {
  const [placeholder, setPlaceholder] = useState('Paris → Bordeaux');

  useEffect(() => {
    if (expanded) return;
    const placeholders = ['Paris → Bordeaux', 'Lyon → Marseille', 'Lille → Paris', 'Nantes → Rennes'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setPlaceholder(placeholders[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, [expanded]);

  return (
    <View style={styles.searchSection}>
      <Pressable onPress={onToggleExpanded}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <Text style={styles.searchPlaceholder}>
              {expanded ? 'Où allez-vous ?' : placeholder}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.textMuted}
            />
          </View>
        </View>
      </Pressable>

      {expanded && (
        <Animated.View entering={FadeInDown.duration(200)} style={styles.searchExpanded}>
          <View style={styles.searchField}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="De..."
              placeholderTextColor={Colors.textMuted}
              value={fromCity}
              onChangeText={onFromChange}
            />
          </View>
          <View style={styles.searchField}>
            <Ionicons name="flag" size={18} color={Colors.success} />
            <TextInput
              style={styles.searchInput}
              placeholder="Vers..."
              placeholderTextColor={Colors.textMuted}
              value={toCity}
              onChangeText={onToChange}
              onSubmitEditing={onSearch}
              returnKeyType="search"
            />
          </View>
          <Pressable style={styles.searchButton} onPress={onSearch}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.searchButtonGradient}
            >
              <Text style={styles.searchButtonText}>Rechercher</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}

      {showResults && results.length > 0 && (
        <Animated.View entering={FadeInUp.duration(300)} style={styles.searchResults}>
          <Text style={styles.resultsTitle}>
            {results.length} trains trouvés
          </Text>
          {results.slice(0, 3).map((train, index) => (
            <Animated.View
              key={train.id}
              entering={SlideInRight.delay(index * 100).springify()}
            >
              <Pressable
                style={styles.resultCard}
                onPress={() => onBookTrain(train)}
              >
                <View style={styles.resultLeft}>
                  <Text style={styles.resultTime}>
                    {formatTime(train.departure.time)}
                  </Text>
                  <Text style={styles.resultDuration}>{Math.floor(train.duration / 60)}h{train.duration % 60}</Text>
                </View>
                <View style={styles.resultCenter}>
                  <Text style={styles.resultRoute}>
                    {train.departure?.station?.city ?? '—'} → {train.arrival?.station?.city ?? '—'}
                  </Text>
                  <Text style={styles.resultTrain}>{train.trainNumber ?? '—'}</Text>
                </View>
                <View style={styles.resultRight}>
                  {train.originalPrice && (
                    <Text style={styles.resultOriginalPrice}>{train.originalPrice}€</Text>
                  )}
                  <Text style={styles.resultPrice}>{train.price}€</Text>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

// ============= PRICE PREDICTION CARD =============
interface PricePredictionProps {
  route: typeof savedRoutes[0];
  priceData: number[];
  onBook: () => void;
  onCreateAlert: () => void;
  onChangeRoute: () => void;
}

function PricePredictionCard({ route, priceData, onBook, onCreateAlert, onChangeRoute }: PricePredictionProps) {
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const priceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <GlassCard variant="ai" animated={false}>
      <View style={styles.aiHeroCard}>
        <View style={styles.aiHeroHeader}>
          <Pressable onPress={onChangeRoute} style={styles.routeSwitcher}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={14} color="#FFF" />
              <Text style={styles.aiBadgeText}>Prix Prédictif</Text>
            </View>
            <Ionicons name="swap-horizontal" size={16} color={Colors.primary} style={{ marginLeft: 8 }} />
          </Pressable>
          <Text style={styles.aiSavings}>
            -{Math.round((1 - route.price / route.originalPrice) * 100)}%
          </Text>
        </View>

        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>{route.origin} → {route.destination}</Text>
          <Text style={styles.routeSubtitle}>Meilleur prix détecté</Text>
        </View>

        {/* Animated Price Chart */}
        <View style={styles.priceChartContainer}>
          <PriceChartAnimated data={priceData} />
          <View style={styles.priceChartLabels}>
            <Text style={styles.chartLabel}>Il y a 12j</Text>
            <View style={styles.bestMomentBadge}>
              <PulsingDot />
              <Text style={styles.bestMomentText}>Meilleur moment</Text>
            </View>
            <Text style={styles.chartLabel}>Aujourd'hui</Text>
          </View>
        </View>

        {/* Price Display */}
        <View style={styles.priceDisplay}>
          <Animated.View style={[styles.priceContainer, priceStyle]}>
            <Text style={styles.originalPrice}>{route.originalPrice}€</Text>
            <Text style={styles.currentPrice}>{route.price}€</Text>
          </Animated.View>
          <View style={styles.confidenceMeter}>
            <Ionicons name="analytics" size={16} color={Colors.primary} />
            <Text style={styles.confidenceText}>
              IA {route.confidence}% sûre — prix va monter dans {route.daysUntilRise}j
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.bookButton} onPress={onBook}>
            <LinearGradient
              colors={[Colors.success, '#059669']}
              style={styles.bookButtonGradient}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={styles.bookButtonText}>Réserver à {route.price}€</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.alertButton} onPress={onCreateAlert}>
            <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
            <Text style={styles.alertButtonText}>Alerte prix</Text>
          </Pressable>
        </View>
      </View>
    </GlassCard>
  );
}

// ============= DISRUPTION CARD =============
interface DisruptionCardProps {
  disruption: typeof disruptions[0];
  delay: number;
  onSwap: () => void;
}

function DisruptionCard({ disruption, delay, onSwap }: DisruptionCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <GlassCard variant="default" animated={false} style={styles.disruptionCardContainer}>
        <View style={styles.disruptionCard}>
          <View style={styles.disruptionLeft}>
            <View style={styles.disruptionIcon}>
              <Ionicons name="warning" size={20} color={Colors.warning} />
            </View>
          </View>
          <View style={styles.disruptionContent}>
            <View style={styles.disruptionHeader}>
              <Text style={styles.disruptionTitle}>
                ⚠️ {disruption.route} +{disruption.delay}min retard
              </Text>
            </View>
            <Text style={styles.disruptionTrain}>{disruption.trainNumber}</Text>
            <View style={styles.aiSolution}>
              <Text style={styles.aiSolutionIcon}>🤖</Text>
              <Text style={styles.aiSolutionText}>
                IA: Alternative trouvée! Train de {disruption.alternativeTime}
                {disruption.sameArrival ? ', arrivée identique' : ''}
                {disruption.priceDiff > 0 ? ` (+${disruption.priceDiff}€)` : ''}
              </Text>
            </View>
          </View>
          <Pressable style={styles.swapButton} onPress={onSwap}>
            <Text style={styles.swapButtonText}>Changer →</Text>
          </Pressable>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

// ============= LIVE DISRUPTION CARD (for real API data) =============
interface LiveDisruptionCardProps {
  disruption: NavitiaDisruption;
  delay: number;
}

function LiveDisruptionCard({ disruption, delay }: LiveDisruptionCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <GlassCard variant="default" animated={false} style={styles.disruptionCardContainer}>
        <View style={styles.disruptionCard}>
          <View style={styles.disruptionLeft}>
            <View style={styles.disruptionIcon}>
              <Ionicons name="warning" size={20} color={Colors.warning} />
            </View>
          </View>
          <View style={styles.disruptionContent}>
            <View style={styles.disruptionHeader}>
              <Text style={styles.disruptionTitle} numberOfLines={2}>
                ⚠️ {disruption.title}
              </Text>
            </View>
            {disruption.affectedLines.length > 0 && (
              <Text style={styles.disruptionTrain} numberOfLines={1}>
                Lignes: {disruption.affectedLines.slice(0, 3).join(', ')}
              </Text>
            )}
            <View style={styles.aiSolution}>
              <Text style={styles.aiSolutionIcon}>ℹ️</Text>
              <Text style={styles.aiSolutionText} numberOfLines={2}>
                {disruption.message?.substring(0, 100) || 'Consultez les horaires pour les alternatives'}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

// ============= NEXT TRIP CARD =============
interface NextTripCardProps {
  trip: typeof import('../../src/services/mockData').userTrips[0];
  countdown: ReturnType<typeof getCountdown>;
  weather: Weather | null;
  expanded: boolean;
  onToggleExpanded: () => void;
}

function NextTripCard({ trip, countdown, weather, expanded, onToggleExpanded }: NextTripCardProps) {
  return (
    <Pressable onPress={onToggleExpanded}>
      <GlassCard variant="elevated" animated={false}>
        <View style={styles.nextTripCard}>
          {/* Compact view */}
          <View style={styles.tripCompact}>
            <View style={styles.tripMainInfo}>
              <Text style={styles.tripRouteText}>
                {trip?.train?.departure?.station?.city ?? '—'} → {trip?.train?.arrival?.station?.city ?? '—'}
              </Text>
              {countdown && (
                <CountdownTimer countdown={countdown} />
              )}
            </View>
            <View style={styles.tripQuickInfo}>
              <View style={styles.tripInfoChip}>
                <Ionicons name="location" size={14} color={Colors.primary} />
                <Text style={styles.tripInfoText}>Voie {trip?.train?.departure?.platform ?? '—'}</Text>
              </View>
              <View style={styles.tripInfoChip}>
                <Ionicons name="person" size={14} color={Colors.primary} />
                <Text style={styles.tripInfoText}>Place {trip.seat}</Text>
              </View>
              {weather && (
                <View style={styles.tripInfoChip}>
                  <Text style={styles.weatherIcon}>{weather.icon}</Text>
                  <Text style={styles.tripInfoText}>{weather.temperature}°</Text>
                </View>
              )}
            </View>
          </View>

          {/* Expanded details */}
          {expanded && (
            <Animated.View entering={FadeInDown.duration(200)} style={styles.tripExpanded}>
              <View style={styles.tripDivider} />
              <View style={styles.tripTimes}>
                <View style={styles.tripTimeBlock}>
                  <Text style={styles.tripTimeLabel}>Départ</Text>
                  <Text style={styles.tripTime}>{formatTime(trip.train.departure.time)}</Text>
                  <Text style={styles.tripStation}>{trip.train.departure.station.name}</Text>
                </View>
                <View style={styles.tripTimeLine}>
                  <View style={styles.tripDot} />
                  <View style={styles.tripLineBar} />
                  <Ionicons name="train" size={16} color={Colors.primary} />
                  <View style={styles.tripLineBar} />
                  <View style={[styles.tripDot, styles.tripDotFilled]} />
                </View>
                <View style={[styles.tripTimeBlock, styles.tripTimeBlockRight]}>
                  <Text style={styles.tripTimeLabel}>Arrivée</Text>
                  <Text style={styles.tripTime}>{formatTime(trip.train.arrival.time)}</Text>
                  <Text style={styles.tripStation}>{trip.train.arrival.station.name}</Text>
                </View>
              </View>
              <View style={styles.tripDetails}>
                <View style={styles.tripDetailRow}>
                  <Ionicons name="train-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.tripDetailText}>{trip.train.trainNumber}</Text>
                </View>
                <View style={styles.tripDetailRow}>
                  <Ionicons name="cube-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.tripDetailText}>Voiture {trip.coach}</Text>
                </View>
                <View style={styles.tripDetailRow}>
                  <Ionicons name="ticket-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.tripDetailText}>{trip.ticketCode}</Text>
                </View>
              </View>
            </Animated.View>
          )}

          <View style={styles.tripExpandHint}>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.textMuted}
            />
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

// ============= COUNTDOWN TIMER =============
function CountdownTimer({ countdown }: { countdown: NonNullable<ReturnType<typeof getCountdown>> }) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.countdownBadge}>
      <Ionicons name="time" size={14} color="#FFF" />
      <Text style={styles.countdownText}>
        {countdown.isToday
          ? `${countdown.hours}h ${countdown.minutes}m`
          : countdown.isTomorrow
          ? 'Demain'
          : `${countdown.days}j`}
      </Text>
    </View>
  );
}

// ============= INSIGHT CARD =============
interface InsightCardProps {
  insight: typeof aiInsights[0];
  delay: number;
  onAction: () => void;
}

function InsightCard({ insight, delay, onAction }: InsightCardProps) {
  return (
    <Animated.View entering={FadeInRight.delay(delay).springify()}>
      <Pressable onPress={onAction}>
        <View style={styles.insightCard}>
          <View style={styles.insightIconContainer}>
            <Ionicons
              name={insight.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.insightText}>{insight.text}</Text>
          <Text style={styles.insightDetail}>{insight.detail}</Text>
          <View style={styles.insightCta}>
            <Text style={styles.insightCtaText}>{insight.cta}</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ============= ANIMATED COMPONENTS =============
function PriceChartAnimated({ data }: { data: number[] }) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  return (
    <View style={styles.chartContainer}>
      {data.map((value, index) => {
        const height = ((value - minValue) / range) * 60 + 20;
        const isLast = index === data.length - 1;
        const isBest = value === Math.min(...data);
        return (
          <AnimatedBar
            key={index}
            height={height}
            isLast={isLast}
            isBest={isBest}
            delay={index * 50}
          />
        );
      })}
    </View>
  );
}

function AnimatedBar({ height, isLast, isBest, delay }: { height: number; isLast: boolean; isBest: boolean; delay: number }) {
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = withSpring(height, { damping: 12, stiffness: 100 });
  }, [height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <Animated.View
      style={[
        styles.chartBar,
        animatedStyle,
        isBest && styles.chartBarBest,
        isLast && styles.chartBarLast,
      ]}
    />
  );
}

function PulsingDot({ color = Colors.success }: { color?: string }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.pulsingDot, { backgroundColor: color }, animatedStyle]} />
  );
}

// ============= STYLES =============
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  // Search Section
  searchSection: {
    marginBottom: Spacing.sm,
  },
  searchBarContainer: {
    ...Shadows.small,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardBackground,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    ...Typography.body,
    color: Colors.textMuted,
    flex: 1,
  },
  searchExpanded: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
    padding: 0,
  },
  searchButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  searchButtonGradient: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  searchButtonText: {
    ...Typography.bodyBold,
    color: '#FFF',
  },
  searchResults: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    ...Shadows.small,
  },
  resultsTitle: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  resultLeft: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  resultTime: {
    ...Typography.bodyBold,
    color: Colors.navy,
  },
  resultDuration: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  resultCenter: {
    flex: 1,
  },
  resultRoute: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resultTrain: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  resultRight: {
    alignItems: 'flex-end',
  },
  resultOriginalPrice: {
    ...Typography.small,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  resultPrice: {
    ...Typography.bodyBold,
    color: Colors.success,
  },

  // AI Hero Card
  aiHeroCard: {
    gap: Spacing.md,
  },
  aiHeroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  aiBadgeText: {
    ...Typography.smallBold,
    color: '#FFF',
  },
  aiSavings: {
    ...Typography.h2,
    color: Colors.success,
    fontWeight: '700',
  },
  routeHeader: {
    gap: 2,
  },
  routeTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  routeSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  priceChartContainer: {
    marginVertical: Spacing.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    gap: 4,
  },
  chartBar: {
    flex: 1,
    backgroundColor: Colors.divider,
    borderRadius: 4,
  },
  chartBarBest: {
    backgroundColor: Colors.success,
  },
  chartBarLast: {
    backgroundColor: Colors.primary,
  },
  priceChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  chartLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  bestMomentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  bestMomentText: {
    ...Typography.smallBold,
    color: Colors.success,
  },
  priceDisplay: {
    gap: Spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  originalPrice: {
    ...Typography.h3,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    ...Typography.h1,
    color: Colors.success,
    fontWeight: '700',
  },
  confidenceMeter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  confidenceText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  bookButton: {
    flex: 2,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  bookButtonText: {
    ...Typography.bodyBold,
    color: '#FFF',
  },
  alertButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.aiGlow,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  alertButtonText: {
    ...Typography.captionBold,
    color: Colors.primary,
  },

  // Disruption Card
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  liveText: {
    ...Typography.smallBold,
    color: Colors.error,
  },
  disruptionCardContainer: {
    marginBottom: Spacing.sm,
  },
  disruptionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  disruptionLeft: {},
  disruptionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disruptionContent: {
    flex: 1,
    gap: 4,
  },
  disruptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  disruptionTitle: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  disruptionTrain: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  aiSolution: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
    backgroundColor: Colors.aiGlow,
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  aiSolutionIcon: {
    fontSize: 14,
  },
  aiSolutionText: {
    ...Typography.small,
    color: Colors.textSecondary,
    flex: 1,
  },
  swapButton: {
    backgroundColor: Colors.success,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  swapButtonText: {
    ...Typography.smallBold,
    color: '#FFF',
  },
  noDisruptionsCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  noDisruptionsText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  noDisruptionsSubtext: {
    ...Typography.small,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Next Trip Card
  nextTripCard: {
    gap: Spacing.sm,
  },
  tripCompact: {
    gap: Spacing.sm,
  },
  tripMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripRouteText: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  tripQuickInfo: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tripInfoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tripInfoText: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  weatherIcon: {
    fontSize: 14,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  countdownText: {
    ...Typography.smallBold,
    color: '#FFF',
  },
  tripExpanded: {
    gap: Spacing.md,
  },
  tripDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  tripTimes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripTimeBlock: {
    flex: 1,
  },
  tripTimeBlockRight: {
    alignItems: 'flex-end',
  },
  tripTimeLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  tripTime: {
    ...Typography.h2,
    color: Colors.navy,
  },
  tripStation: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  tripTimeLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
  },
  tripDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  tripDotFilled: {
    backgroundColor: Colors.primary,
  },
  tripLineBar: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.divider,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  tripDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDetailText: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  tripExpandHint: {
    alignItems: 'center',
  },

  // Insights
  insightsContainer: {
    paddingRight: Spacing.md,
    gap: Spacing.sm,
  },
  insightCard: {
    width: SCREEN_WIDTH * 0.42,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.small,
  },
  insightIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.aiGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
  },
  insightDetail: {
    ...Typography.small,
    color: Colors.success,
  },
  insightCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  insightCtaText: {
    ...Typography.smallBold,
    color: Colors.primary,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },

  bottomSpacer: {
    height: 100,
  },
});
