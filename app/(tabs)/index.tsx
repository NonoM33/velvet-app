import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard, AnimatedCounter } from '../../src/components';
import { useStore } from '../../src/store/store';
import { formatTime, formatDate, getCountdown } from '../../src/services/navitia';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/constants/theme';

// Animated price chart data
const priceData = [45, 52, 48, 39, 35, 29, 32, 28, 25, 31, 27, 24];

export default function HomeScreen() {
  const { user, upcomingTrips } = useStore();
  const nextTrip = upcomingTrips[0];
  const [searchPlaceholder, setSearchPlaceholder] = useState('Paris → Bordeaux');

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

  // Animate search placeholder
  useEffect(() => {
    const placeholders = ['Paris → Bordeaux', 'Lyon → Marseille', 'Lille → Paris', 'Nantes → Rennes'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setSearchPlaceholder(placeholders[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const countdown = nextTrip ? getCountdown(nextTrip.train.departure.time) : null;

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
        >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()} {user.name} 👋
              </Text>
              <Text style={styles.subtitle}>Où allons-nous aujourd'hui ?</Text>
            </View>
          </Animated.View>

          {/* Search Bar */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Pressable onPress={handleSearch}>
              <View style={styles.searchBarContainer}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color={Colors.textMuted} />
                  <Text style={styles.searchPlaceholder}>
                    {searchPlaceholder}
                  </Text>
                  <View style={styles.micButton}>
                    <Ionicons name="mic" size={18} color={Colors.primary} />
                  </View>
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {/* AI FEATURE 1: Prix Prédictif IA - HERO CARD */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Pressable onPress={() => router.push('/chat')}>
              <GlassCard variant="ai" animated={false}>
                <View style={styles.aiHeroCard}>
                  <View style={styles.aiHeroHeader}>
                    <View style={styles.aiBadge}>
                      <Ionicons name="sparkles" size={14} color="#FFF" />
                      <Text style={styles.aiBadgeText}>Prix Prédictif IA</Text>
                    </View>
                    <Text style={styles.aiSavings}>-34%</Text>
                  </View>

                  <View style={styles.routeHeader}>
                    <Text style={styles.routeTitle}>Paris → Bordeaux</Text>
                    <Text style={styles.routeSubtitle}>Mardi 12 mars</Text>
                  </View>

                  {/* Animated Price Chart */}
                  <View style={styles.priceChartContainer}>
                    <PriceChartAnimated data={priceData} />
                    <View style={styles.priceChartLabels}>
                      <Text style={styles.chartLabel}>Il y a 7j</Text>
                      <View style={styles.bestMomentBadge}>
                        <PulsingDot />
                        <Text style={styles.bestMomentText}>Meilleur moment</Text>
                      </View>
                      <Text style={styles.chartLabel}>Aujourd'hui</Text>
                    </View>
                  </View>

                  <View style={styles.aiPrediction}>
                    <View style={styles.predictionRow}>
                      <View style={styles.priceCompare}>
                        <Text style={styles.originalPrice}>39€</Text>
                        <Ionicons name="arrow-forward" size={16} color={Colors.success} />
                        <Text style={styles.currentPrice}>24€</Text>
                      </View>
                      <View style={styles.buyNowBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                        <Text style={styles.buyNowText}>Acheter maintenant</Text>
                      </View>
                    </View>
                    <Text style={styles.predictionInfo}>
                      L'IA prédit une hausse de 15% dans 3 jours
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>

          {/* AI FEATURE 2: Perturbation Intelligence */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.sectionTitle}>Intelligence Perturbations</Text>
            <GlassCard variant="default" animated={false}>
              <Pressable onPress={() => router.push('/chat')} style={styles.disruptionCard}>
                <View style={styles.disruptionIcon}>
                  <Ionicons name="warning" size={24} color={Colors.warning} />
                </View>
                <View style={styles.disruptionContent}>
                  <View style={styles.disruptionHeader}>
                    <Text style={styles.disruptionTitle}>Retard 15min détecté</Text>
                    <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  </View>
                  <Text style={styles.disruptionRoute}>TGV 8541 • Paris → Lyon</Text>
                  <View style={styles.aiSolution}>
                    <Ionicons name="sparkles" size={14} color={Colors.primary} />
                    <Text style={styles.aiSolutionText}>
                      Alternative trouvée en 2 sec → TGV 8543 (+5€)
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </Pressable>
            </GlassCard>
          </Animated.View>

          {/* AI FEATURE 3: Assistant Velvet IA */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Text style={styles.sectionTitle}>Assistant Velvet IA</Text>
            <Pressable onPress={() => router.push('/chat')}>
              <GlassCard variant="ai" animated={false}>
                <View style={styles.assistantCard}>
                  <View style={styles.assistantHeader}>
                    <LinearGradient
                      colors={[Colors.primary, Colors.primaryDark]}
                      style={styles.assistantAvatar}
                    >
                      <Ionicons name="sparkles" size={20} color="#FFF" />
                    </LinearGradient>
                    <View style={styles.assistantInfo}>
                      <Text style={styles.assistantName}>Velvet AI</Text>
                      <Text style={styles.assistantStatus}>Toujours disponible</Text>
                    </View>
                  </View>
                  <View style={styles.lastMessage}>
                    <Text style={styles.lastMessageText}>
                      "J'ai trouvé 3 trains pour Bordeaux à moins de 30€ ! Voulez-vous que je vous les montre ?"
                    </Text>
                  </View>
                  <View style={styles.assistantCta}>
                    <Text style={styles.ctaText}>Discuter</Text>
                    <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>

          {/* Next Trip Card (if any) */}
          {nextTrip && (
            <Animated.View entering={FadeInDown.delay(500).duration(400)}>
              <Text style={styles.sectionTitle}>Prochain voyage</Text>
              <Pressable onPress={() => router.push(`/journey/${nextTrip.id}`)}>
                <GlassCard variant="elevated" animated={false}>
                  <View style={styles.nextTripCard}>
                    <View style={styles.tripHeader}>
                      <View style={styles.routeInfo}>
                        <Text style={styles.tripRouteText}>
                          {nextTrip.train.departure.station.city} → {nextTrip.train.arrival.station.city}
                        </Text>
                        <Text style={styles.tripDate}>
                          {formatDate(nextTrip.train.departure.time)}
                        </Text>
                      </View>
                      {countdown && (
                        <View style={styles.countdownBadge}>
                          <Text style={styles.countdownText}>
                            {countdown.isToday
                              ? `${countdown.hours}h ${countdown.minutes}m`
                              : countdown.isTomorrow
                              ? 'Demain'
                              : `${countdown.days}j`}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.tripTimes}>
                      <Text style={styles.departureTime}>
                        {formatTime(nextTrip.train.departure.time)}
                      </Text>
                      <View style={styles.tripLine}>
                        <View style={styles.tripDot} />
                        <View style={styles.tripLineBar} />
                        <Ionicons name="train" size={14} color={Colors.primary} />
                      </View>
                      <Text style={styles.arrivalTime}>
                        {formatTime(nextTrip.train.arrival.time)}
                      </Text>
                    </View>

                    <View style={styles.tripFooter}>
                      <View style={styles.tripDetail}>
                        <Ionicons name="location" size={14} color={Colors.textMuted} />
                        <Text style={styles.tripDetailText}>
                          Voie {nextTrip.train.departure.platform} • Coach {nextTrip.coach} • Place {nextTrip.seat}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            </Animated.View>
          )}

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
    </LinearGradient>
  );
}

// Animated price chart component
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
    animatedHeight.value = withTiming(height, { duration: 800, easing: Easing.out(Easing.cubic) });
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

function PulsingDot() {
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
    <Animated.View style={[styles.pulsingDot, animatedStyle]} />
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
  searchBarContainer: {
    ...Shadows.small,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardBackground,
    marginBottom: Spacing.lg,
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
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.aiGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  // AI Hero Card - Prix Prédictif
  aiHeroCard: {
    gap: Spacing.md,
  },
  aiHeroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  aiPrediction: {
    gap: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceCompare: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  originalPrice: {
    ...Typography.body,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    ...Typography.h2,
    color: Colors.success,
    fontWeight: '700',
  },
  buyNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  buyNowText: {
    ...Typography.smallBold,
    color: '#FFF',
  },
  predictionInfo: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  // Disruption Card
  disruptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  disruptionIcon: {
    width: 48,
    height: 48,
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
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.errorLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  liveText: {
    ...Typography.small,
    color: Colors.error,
    fontWeight: '700',
  },
  disruptionRoute: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  aiSolution: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  aiSolutionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '500',
  },

  // Assistant Card
  assistantCard: {
    gap: Spacing.md,
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  assistantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantInfo: {
    flex: 1,
  },
  assistantName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  assistantStatus: {
    ...Typography.small,
    color: Colors.success,
  },
  lastMessage: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  lastMessageText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  assistantCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  ctaText: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },

  // Next Trip Card
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
  tripRouteText: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  tripDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  countdownBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  countdownText: {
    ...Typography.smallBold,
    color: '#FFF',
  },
  tripTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  departureTime: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  tripLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  tripLineBar: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.divider,
  },
  arrivalTime: {
    ...Typography.h2,
    color: Colors.textSecondary,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tripDetailText: {
    ...Typography.caption,
    color: Colors.textMuted,
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
