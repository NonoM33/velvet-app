import React, { useState } from 'react';
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
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { GlassCard } from '../../src/components';
import { useStore } from '../../src/store/store';
import { formatTime, formatDate, getCountdown } from '../../src/services/navitia';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/constants/theme';
import { Trip } from '../../src/services/types';

type TabType = 'upcoming' | 'past';

export default function TripsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const { upcomingTrips, pastTrips } = useStore();

  const handleTabChange = (tab: TabType) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveTab(tab);
  };

  const trips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

  // Calculate AI savings for past trips
  const totalAISavings = pastTrips.reduce((acc, trip) => acc + (trip.aiSavings || 0), 0);

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Text style={styles.title}>Mes voyages</Text>
          <Text style={styles.subtitle}>
            {upcomingTrips.length} voyage{upcomingTrips.length > 1 ? 's' : ''} à venir
          </Text>
        </Animated.View>

        {/* AI Savings Banner */}
        {totalAISavings > 0 && (
          <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.savingsBanner}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.savingsGradient}
            >
              <View style={styles.savingsContent}>
                <Ionicons name="sparkles" size={20} color="#FFF" />
                <Text style={styles.savingsText}>
                  Économies grâce à l'IA: <Text style={styles.savingsAmount}>{totalAISavings}€</Text>
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Tab Switcher */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => handleTabChange('upcoming')}
              style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
            >
              {activeTab === 'upcoming' ? (
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.tabGradient}
                >
                  <Ionicons name="time" size={16} color="#fff" />
                  <Text style={styles.tabTextActive}>À venir</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactive}>
                  <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.tabText}>À venir</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={() => handleTabChange('past')}
              style={[styles.tab, activeTab === 'past' && styles.tabActive]}
            >
              {activeTab === 'past' ? (
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.tabGradient}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.tabTextActive}>Historique</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactive}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.tabText}>Historique</Text>
                </View>
              )}
            </Pressable>
          </View>
        </Animated.View>

        {/* Trips List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {trips.length === 0 ? (
            <Animated.View
              entering={FadeInDown.delay(200).duration(400)}
              style={styles.emptyState}
            >
              <GlassCard variant="default">
                <View style={styles.emptyContent}>
                  <View style={styles.emptyIcon}>
                    <Ionicons
                      name={activeTab === 'upcoming' ? 'train-outline' : 'time-outline'}
                      size={40}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={styles.emptyTitle}>
                    {activeTab === 'upcoming'
                      ? 'Aucun voyage prévu'
                      : 'Pas encore de voyages'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {activeTab === 'upcoming'
                      ? 'Planifiez votre prochain voyage avec Velvet AI'
                      : 'Vos voyages terminés apparaîtront ici'}
                  </Text>
                  {activeTab === 'upcoming' && (
                    <Pressable
                      onPress={() => router.push('/chat')}
                      style={styles.emptyButton}
                    >
                      <LinearGradient
                        colors={[Colors.primary, Colors.primaryDark]}
                        style={styles.emptyButtonGradient}
                      >
                        <Ionicons name="sparkles" size={16} color="#fff" />
                        <Text style={styles.emptyButtonText}>
                          Demander à l'IA
                        </Text>
                      </LinearGradient>
                    </Pressable>
                  )}
                </View>
              </GlassCard>
            </Animated.View>
          ) : (
            <>
              {/* Timeline View */}
              <View style={styles.timeline}>
                {trips.map((trip, index) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    index={index}
                    isLast={index === trips.length - 1}
                    isPast={activeTab === 'past'}
                  />
                ))}
              </View>
            </>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

interface TripCardProps {
  trip: Trip;
  index: number;
  isLast: boolean;
  isPast: boolean;
}

function TripCard({ trip, index, isLast, isPast }: TripCardProps) {
  const countdown = getCountdown(trip.train.departure.time);

  const getStatusColor = () => {
    switch (trip.status) {
      case 'upcoming':
        return Colors.primary;
      case 'ongoing':
        return Colors.warning;
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
    }
  };

  const getStatusLabel = () => {
    switch (trip.status) {
      case 'upcoming':
        return 'À venir';
      case 'ongoing':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100 + 200).duration(400)}
      style={styles.tripCardContainer}
    >
      {/* Timeline dot and line */}
      <View style={styles.timelineIndicator}>
        <View style={[styles.timelineDot, { backgroundColor: getStatusColor() }]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      {/* Trip Card */}
      <Pressable
        style={styles.tripCard}
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          router.push(`/journey/${trip.id}`);
        }}
      >
        <View style={styles.tripCardInner}>
          <View style={styles.tripContent}>
            {/* Header */}
            <View style={styles.tripHeader}>
              <View style={styles.routeContainer}>
                <Text style={styles.route}>
                  {trip.train.departure.station.city} → {trip.train.arrival.station.city}
                </Text>
                <Text style={styles.tripDate}>
                  {formatDate(trip.train.departure.time)}
                </Text>
              </View>
              <View
                style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}
              >
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                  {getStatusLabel()}
                </Text>
              </View>
            </View>

            {/* Times */}
            <View style={styles.timesRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Départ</Text>
                <Text style={styles.time}>
                  {formatTime(trip.train.departure.time)}
                </Text>
              </View>
              <View style={styles.durationContainer}>
                <View style={styles.timeLine}>
                  <View style={styles.timeDot} />
                  <View style={styles.timeLineBar} />
                  <Ionicons name="train" size={14} color={Colors.primary} />
                </View>
              </View>
              <View style={[styles.timeBlock, styles.timeBlockRight]}>
                <Text style={styles.timeLabel}>Arrivée</Text>
                <Text style={styles.time}>
                  {formatTime(trip.train.arrival.time)}
                </Text>
              </View>
            </View>

            {/* AI Insight for past trips */}
            {isPast && trip.aiSavings && trip.aiSavings > 0 && (
              <View style={styles.aiInsight}>
                <Ionicons name="sparkles" size={14} color={Colors.primary} />
                <Text style={styles.aiInsightText}>
                  Vous avez économisé <Text style={styles.aiSavingsText}>{trip.aiSavings}€</Text> grâce à l'IA
                </Text>
              </View>
            )}

            {/* Details */}
            <View style={styles.tripDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="train" size={14} color={Colors.primary} />
                <Text style={styles.detailText}>{trip.train.trainNumber}</Text>
              </View>
              {trip.coach && trip.seat && (
                <View style={styles.detailItem}>
                  <Ionicons name="location" size={14} color={Colors.primary} />
                  <Text style={styles.detailText}>
                    Voiture {trip.coach} • Place {trip.seat}
                  </Text>
                </View>
              )}
              {trip.status === 'upcoming' && countdown && (
                <View style={styles.countdownContainer}>
                  <View style={styles.countdownBadge}>
                    <Ionicons name="time" size={12} color={Colors.primary} />
                    <Text style={styles.countdownText}>
                      {countdown.isToday
                        ? `Dans ${countdown.hours}h ${countdown.minutes}min`
                        : countdown.isTomorrow
                        ? 'Demain'
                        : `Dans ${countdown.days} jour${countdown.days > 1 ? 's' : ''}`}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Ticket Code */}
            {trip.ticketCode && trip.status !== 'completed' && (
              <View style={styles.ticketContainer}>
                <View style={styles.ticketDivider} />
                <View style={styles.ticketContent}>
                  <View style={styles.qrPlaceholder}>
                    <Ionicons name="qr-code" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketLabel}>Code billet</Text>
                    <Text style={styles.ticketCode}>{trip.ticketCode}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  savingsBanner: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  savingsGradient: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  savingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  savingsText: {
    ...Typography.body,
    color: '#FFF',
  },
  savingsAmount: {
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
  },
  tabActive: {},
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  tabInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tabTextActive: {
    ...Typography.bodyBold,
    color: '#fff',
  },
  tabText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
  },
  emptyState: {
    marginTop: Spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.aiGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  emptyButton: {
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  emptyButtonText: {
    ...Typography.bodyBold,
    color: '#fff',
  },
  timeline: {
    paddingTop: Spacing.sm,
  },
  tripCardContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timelineIndicator: {
    width: 24,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 24,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.divider,
    marginTop: 4,
  },
  tripCard: {
    flex: 1,
  },
  tripCardInner: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
  },
  tripContent: {
    gap: Spacing.sm,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeContainer: {
    flex: 1,
  },
  route: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  tripDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    ...Typography.small,
    fontWeight: '600',
  },
  timesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  timeBlock: {
    flex: 1,
  },
  timeBlockRight: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  time: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  durationContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  timeLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  timeLineBar: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.divider,
  },
  aiInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.aiGlow,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  aiInsightText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  aiSavingsText: {
    color: Colors.success,
    fontWeight: '700',
  },
  tripDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  detailText: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  countdownContainer: {
    marginLeft: 'auto',
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.aiGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  countdownText: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  ticketContainer: {
    marginTop: Spacing.xs,
  },
  ticketDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: Spacing.sm,
  },
  ticketContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qrPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  ticketCode: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bottomSpacer: {
    height: 120,
  },
});
