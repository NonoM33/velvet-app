/**
 * Home Screen
 * Main dashboard with search, price prediction, disruptions, and trip info
 * Refactored for maintainability (<300 lines)
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import {
  BookingModal,
  showToast,
  SmartSearchSection,
  PricePredictionCard,
  DisruptionHeader,
  LiveDisruptionCard,
  NoDisruptionsCard,
  NextTripCard,
  InsightsContainer,
  StatsRow,
} from '../../src/components';

import { useStore } from '../../src/store/store';
import {
  searchTrainsByCity,
  getDisruptions,
  getCountdown,
  Disruption as NavitiaDisruption,
} from '../../src/services/navitia';
import { parisBordeauxTrains } from '../../src/services/mockData';
import { getWeatherCached, getFallbackWeather } from '../../src/services/weather';
import { Colors, Spacing, Typography, Layout } from '../../src/constants/theme';
import type { Train, Weather } from '../../src/services/types';

// Static data
const priceData = [45, 52, 48, 39, 35, 29, 32, 28, 25, 31, 27, 24];

const savedRoutes = [
  { origin: 'Paris', destination: 'Bordeaux', price: 24, originalPrice: 39, confidence: 94, daysUntilRise: 3 },
  { origin: 'Paris', destination: 'Nantes', price: 19, originalPrice: 35, confidence: 91, daysUntilRise: 2 },
];

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

  // Trip card state
  const [tripExpanded, setTripExpanded] = useState(false);

  // Data state
  const [refreshing, setRefreshing] = useState(false);
  const [liveDisruptions, setLiveDisruptions] = useState<NavitiaDisruption[]>([]);
  const [liveWeather, setLiveWeather] = useState<Weather | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  // Fetch live data
  const fetchLiveData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const disruptions = await getDisruptions();
      setLiveDisruptions(disruptions);

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

  // Handlers
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const handleSearch = useCallback(() => {
    if (!toCity.trim()) return;
    triggerHaptic('light');
    const results = searchTrainsByCity(fromCity, toCity);
    setSearchResults(results);
    setShowResults(true);
  }, [fromCity, toCity]);

  const handleBookTrain = useCallback((train: Train) => {
    triggerHaptic('medium');
    setSelectedTrain(train);
    setBookingModalVisible(true);
  }, []);

  const handleCreateAlert = useCallback(() => {
    triggerHaptic('success');
    showToast('Alerte créée', 'success');
  }, []);

  const handleInsightAction = useCallback((insightId: string) => {
    triggerHaptic('light');
    showToast('Action effectuée', 'info');
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    triggerHaptic('light');
    await fetchLiveData();
    setRefreshing(false);
    showToast('Données mises à jour', 'success');
  }, [fetchLiveData]);

  const toggleSearch = useCallback(() => {
    triggerHaptic('light');
    setSearchExpanded(!searchExpanded);
    if (searchExpanded) setShowResults(false);
  }, [searchExpanded]);

  const toggleTrip = useCallback(() => {
    triggerHaptic('light');
    setTripExpanded(!tripExpanded);
  }, [tripExpanded]);

  const changeRoute = useCallback(() => {
    triggerHaptic('light');
    setActiveRouteIndex((i) => (i + 1) % savedRoutes.length);
  }, []);

  const countdown = nextTrip?.train?.departure?.time
    ? getCountdown(nextTrip.train.departure.time)
    : null;

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
          <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
            <Text style={styles.greeting}>{getGreeting()}, {user.name}</Text>
            <Text style={styles.subtitle}>Votre dashboard temps réel</Text>
          </Animated.View>

          {/* Smart Search */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <SmartSearchSection
              expanded={searchExpanded}
              onToggleExpanded={toggleSearch}
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

          {/* Price Prediction */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.sectionTitle}>Prix Prédictif IA</Text>
            <PricePredictionCard
              route={savedRoutes[activeRouteIndex]}
              priceData={priceData}
              onBook={() => {
                const train = parisBordeauxTrains.find(t => t.priceRecommendation === 'buy_now') || parisBordeauxTrains[0];
                handleBookTrain(train);
              }}
              onCreateAlert={handleCreateAlert}
              onChangeRoute={changeRoute}
            />
          </Animated.View>

          {/* Disruptions */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <DisruptionHeader hasDisruptions={liveDisruptions.length > 0} />
            {liveDisruptions.length > 0 ? (
              liveDisruptions.slice(0, 3).map((disruption, index) => (
                <LiveDisruptionCard
                  key={disruption.id}
                  disruption={disruption}
                  delay={index * 80}
                />
              ))
            ) : (
              <NoDisruptionsCard isLoading={isLoadingData} />
            )}
          </Animated.View>

          {/* Next Trip */}
          {nextTrip && (
            <Animated.View entering={FadeInDown.delay(400).duration(400)}>
              <Text style={styles.sectionTitle}>Prochain voyage</Text>
              <NextTripCard
                trip={nextTrip}
                countdown={countdown}
                weather={liveWeather}
                expanded={tripExpanded}
                onToggleExpanded={toggleTrip}
              />
            </Animated.View>
          )}

          {/* AI Insights */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <InsightsContainer
              insights={aiInsights}
              onInsightAction={handleInsightAction}
            />
          </Animated.View>

          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(600).duration(400)}>
            <StatsRow stats={user.stats} />
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      <BookingModal
        visible={bookingModalVisible}
        train={selectedTrain}
        onClose={() => setBookingModalVisible(false)}
        onConfirm={(train) => console.log('Booked:', train.trainNumber)}
      />
    </LinearGradient>
  );
}

// Haptic helper
function triggerHaptic(type: 'light' | 'medium' | 'success') {
  if (Platform.OS === 'web') return;
  if (type === 'success') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } else {
    Haptics.impactAsync(
      type === 'light'
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    );
  }
}

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
    padding: Layout.screenPadding,
    paddingBottom: 120,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.callout,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.smd,
  },
  bottomSpacer: {
    height: 80,
  },
});
