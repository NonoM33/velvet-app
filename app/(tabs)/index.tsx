import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard, TrainCard, AnimatedCounter, PriceChart } from '../../src/components';
import { useStore } from '../../src/store/store';
import { formatTime, formatDate, getCountdown } from '../../src/services/navitia';
import { popularRoutes, weatherData } from '../../src/services/mockData';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

export default function HomeScreen() {
  const { user, upcomingTrips, priceAlerts } = useStore();
  const nextTrip = upcomingTrips[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const handleSearch = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/chat');
  };

  const handleRoutePress = (label: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/chat');
  };

  const countdown = nextTrip ? getCountdown(nextTrip.train.departure.time) : null;

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundLight, Colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()} {user.name} 👋
              </Text>
              <Text style={styles.subtitle}>Où allons-nous aujourd'hui ?</Text>
            </View>
            <View style={styles.tierBadge}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.tierGradient}
              >
                <Ionicons name="star" size={12} color="#000" />
                <Text style={styles.tierText}>{user.tier}</Text>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Search Bar */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Pressable onPress={handleSearch}>
              <GlassCard animated={false}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color={Colors.textMuted} />
                  <Text style={styles.searchPlaceholder}>
                    Rechercher un trajet...
                  </Text>
                  <View style={styles.micButton}>
                    <Ionicons name="mic" size={18} color={Colors.primaryEnd} />
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>

          {/* Popular Routes */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.routesContainer}
            >
              {popularRoutes.map((route, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleRoutePress(route.label)}
                  style={({ pressed }) => [
                    styles.routeChip,
                    pressed && styles.routeChipPressed,
                  ]}
                >
                  <Text style={styles.routeChipText}>{route.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Next Trip Card */}
          {nextTrip && (
            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
              <Text style={styles.sectionTitle}>Prochain voyage</Text>
              <Pressable
                onPress={() => router.push(`/journey/${nextTrip.id}`)}
              >
                <GlassCard animated={false}>
                  <View style={styles.nextTripCard}>
                    <View style={styles.tripHeader}>
                      <View style={styles.routeInfo}>
                        <Text style={styles.routeText}>
                          {nextTrip.train.departure.station.city} →{' '}
                          {nextTrip.train.arrival.station.city}
                        </Text>
                        <Text style={styles.tripDate}>
                          {formatDate(nextTrip.train.departure.time)}
                        </Text>
                      </View>
                      {countdown && (
                        <View style={styles.countdownBadge}>
                          <LinearGradient
                            colors={[Colors.primaryStart, Colors.primaryEnd]}
                            style={styles.countdownGradient}
                          >
                            <Text style={styles.countdownText}>
                              {countdown.isToday
                                ? `${countdown.hours}h ${countdown.minutes}m`
                                : countdown.isTomorrow
                                ? 'Demain'
                                : `${countdown.days}j`}
                            </Text>
                          </LinearGradient>
                        </View>
                      )}
                    </View>

                    <View style={styles.tripDetails}>
                      <View style={styles.timeContainer}>
                        <Text style={styles.departureTime}>
                          {formatTime(nextTrip.train.departure.time)}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color={Colors.textMuted}
                        />
                        <Text style={styles.arrivalTime}>
                          {formatTime(nextTrip.train.arrival.time)}
                        </Text>
                      </View>
                      <View style={styles.platformInfo}>
                        <Ionicons
                          name="train"
                          size={14}
                          color={Colors.primaryEnd}
                        />
                        <Text style={styles.platformText}>
                          Voie {nextTrip.train.departure.platform} • Coach{' '}
                          {nextTrip.coach} • Place {nextTrip.seat}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.tripFooter}>
                      <View style={styles.trainBadge}>
                        <Text style={styles.trainNumber}>
                          {nextTrip.train.trainNumber}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={Colors.textMuted}
                      />
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            </Animated.View>
          )}

          {/* AI Suggestion Card */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Text style={styles.sectionTitle}>💡 Suggestion IA</Text>
            <Pressable onPress={() => router.push('/chat')}>
              <GlassCard animated={false}>
                <View style={styles.aiSuggestionCard}>
                  <LinearGradient
                    colors={[Colors.primaryStart + '20', Colors.primaryEnd + '20']}
                    style={styles.aiIconContainer}
                  >
                    <Ionicons name="sparkles" size={24} color={Colors.primaryEnd} />
                  </LinearGradient>
                  <View style={styles.aiContent}>
                    <Text style={styles.aiTitle}>
                      Billet moins cher détecté !
                    </Text>
                    <Text style={styles.aiDescription}>
                      Paris → Bordeaux à 19€ le mardi prochain. C'est 35% moins
                      cher que d'habitude.
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.textMuted}
                  />
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>

          {/* Price Alerts */}
          {priceAlerts.length > 0 && (
            <Animated.View entering={FadeInDown.delay(500).duration(400)}>
              <Text style={styles.sectionTitle}>📊 Alertes prix</Text>
              {priceAlerts.slice(0, 2).map((alert, index) => (
                <GlassCard key={alert.id} delay={index * 100}>
                  <View style={styles.alertCard}>
                    <View style={styles.alertRoute}>
                      <Text style={styles.alertRouteText}>
                        {alert.route.origin.city} → {alert.route.destination.city}
                      </Text>
                      <Text style={styles.alertTarget}>
                        Objectif: {alert.targetPrice}€
                      </Text>
                    </View>
                    <PriceChart
                      data={[35, 42, 38, 29, 33, 31, alert.currentPrice]}
                      currentPrice={alert.currentPrice}
                      trend={alert.currentPrice <= alert.targetPrice ? 'down' : 'up'}
                      width={100}
                      height={36}
                    />
                  </View>
                </GlassCard>
              ))}
            </Animated.View>
          )}

          {/* Weather Widget */}
          {nextTrip && (
            <Animated.View entering={FadeInDown.delay(600).duration(400)}>
              <Text style={styles.sectionTitle}>
                ☀️ Météo à {nextTrip.train.arrival.station.city}
              </Text>
              <GlassCard animated={false}>
                <View style={styles.weatherCard}>
                  <Text style={styles.weatherIcon}>
                    {weatherData[nextTrip.train.arrival.station.city.toLowerCase()]?.icon || '☀️'}
                  </Text>
                  <View style={styles.weatherInfo}>
                    <Text style={styles.weatherTemp}>
                      {weatherData[nextTrip.train.arrival.station.city.toLowerCase()]?.temperature || 18}°C
                    </Text>
                    <Text style={styles.weatherDesc}>
                      {weatherData[nextTrip.train.arrival.station.city.toLowerCase()]?.description || 'Ensoleillé'}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {/* Stats Row */}
          <Animated.View entering={FadeInDown.delay(700).duration(400)}>
            <Text style={styles.sectionTitle}>📈 Vos stats ce mois</Text>
            <View style={styles.statsRow}>
              <GlassCard style={styles.statCard} delay={0}>
                <AnimatedCounter value={user.stats.totalTrips} suffix=" voyages" />
                <Text style={styles.statLabel}>Total</Text>
              </GlassCard>
              <GlassCard style={styles.statCard} delay={100}>
                <AnimatedCounter
                  value={user.stats.moneySaved}
                  prefix=""
                  suffix="€"
                />
                <Text style={styles.statLabel}>Économisés</Text>
              </GlassCard>
              <GlassCard style={styles.statCard} delay={200}>
                <AnimatedCounter
                  value={user.stats.co2Avoided}
                  suffix=" kg"
                />
                <Text style={styles.statLabel}>CO₂ évité</Text>
              </GlassCard>
            </View>
          </Animated.View>

          {/* Bottom spacing for tab bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
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
  tierBadge: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  tierGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  tierText: {
    ...Typography.small,
    color: '#000',
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    ...Typography.body,
    color: Colors.textMuted,
    flex: 1,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryStart + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routesContainer: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  routeChip: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginRight: Spacing.sm,
  },
  routeChipPressed: {
    backgroundColor: Colors.primaryStart + '30',
    borderColor: Colors.primaryStart,
  },
  routeChipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  nextTripCard: {
    gap: Spacing.md,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  tripDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  countdownBadge: {
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  countdownGradient: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  countdownText: {
    ...Typography.small,
    color: '#fff',
    fontWeight: '600',
  },
  tripDetails: {
    gap: Spacing.xs,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  departureTime: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  arrivalTime: {
    ...Typography.h2,
    color: Colors.textSecondary,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  platformText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
  },
  trainBadge: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  trainNumber: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  aiSuggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  aiDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  alertCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertRoute: {
    flex: 1,
  },
  alertRouteText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  alertTarget: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  weatherIcon: {
    fontSize: 48,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  weatherDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 100,
  },
});
