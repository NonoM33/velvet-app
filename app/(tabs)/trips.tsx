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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Layout,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { GlassCard, showToast } from '../../src/components';
import { useStore } from '../../src/store/store';
import { formatTime, formatDate, getCountdown } from '../../src/services/navitia';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/constants/theme';
import { Trip } from '../../src/services/types';

type TabType = 'upcoming' | 'past';

export default function TripsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
  const { upcomingTrips, pastTrips } = useStore();

  const handleTabChange = (tab: TabType) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveTab(tab);
    setExpandedTripId(null);
  };

  const handleTripPress = (tripId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setExpandedTripId(expandedTripId === tripId ? null : tripId);
  };

  const trips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

  // Calculate AI savings for past trips (simulate some savings)
  const totalAISavings = pastTrips.reduce((acc, trip, index) => {
    // Simulate AI savings based on trip index
    const savings = [34, 12, 28, 15, 42][index % 5] || 0;
    return acc + savings;
  }, 0);

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
                      ? 'Réservez depuis le dashboard'
                      : 'Vos voyages terminés apparaîtront ici'}
                  </Text>
                  {activeTab === 'upcoming' && (
                    <Pressable
                      onPress={() => router.push('/')}
                      style={styles.emptyButton}
                    >
                      <LinearGradient
                        colors={[Colors.primary, Colors.primaryDark]}
                        style={styles.emptyButtonGradient}
                      >
                        <Ionicons name="home" size={16} color="#fff" />
                        <Text style={styles.emptyButtonText}>
                          Aller au dashboard
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
                    isExpanded={expandedTripId === trip.id}
                    onPress={() => handleTripPress(trip.id)}
                    aiSavings={activeTab === 'past' ? [34, 12, 28, 15, 42][index % 5] : undefined}
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
  isExpanded: boolean;
  onPress: () => void;
  aiSavings?: number;
}

function TripCard({ trip, index, isLast, isPast, isExpanded, onPress, aiSavings }: TripCardProps) {
  const countdown = getCountdown(trip.train.departure.time);
  const rotateValue = useSharedValue(0);

  React.useEffect(() => {
    rotateValue.value = withSpring(isExpanded ? 180 : 0, { damping: 15 });
  }, [isExpanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

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

  const handleQuickAction = (action: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    showToast(`${action} effectué`, 'success');
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100 + 200).duration(400)}
      layout={Layout.springify()}
      style={styles.tripCardContainer}
    >
      {/* Timeline dot and line */}
      <View style={styles.timelineIndicator}>
        <View style={[styles.timelineDot, { backgroundColor: getStatusColor() }]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      {/* Trip Card */}
      <Pressable style={styles.tripCard} onPress={onPress}>
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
              <View style={styles.headerRight}>
                <View
                  style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}
                >
                  <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    {getStatusLabel()}
                  </Text>
                </View>
                <Animated.View style={chevronStyle}>
                  <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
                </Animated.View>
              </View>
            </View>

            {/* Compact Info Row */}
            <View style={styles.compactInfo}>
              <Text style={styles.compactTime}>
                {formatTime(trip.train.departure.time)} → {formatTime(trip.train.arrival.time)}
              </Text>
              {trip.status === 'upcoming' && countdown && (
                <View style={styles.countdownBadge}>
                  <Ionicons name="time" size={12} color="#FFF" />
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

            {/* AI Insight for past trips */}
            {isPast && aiSavings && aiSavings > 0 && (
              <View style={styles.aiInsight}>
                <Ionicons name="sparkles" size={14} color={Colors.primary} />
                <Text style={styles.aiInsightText}>
                  Économisé <Text style={styles.aiSavingsText}>{aiSavings}€</Text> grâce à l'IA
                </Text>
              </View>
            )}

            {/* Expanded Content */}
            {isExpanded && (
              <Animated.View entering={FadeInUp.duration(200)} style={styles.expandedContent}>
                <View style={styles.expandedDivider} />

                {/* Full Times Row */}
                <View style={styles.timesRow}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Départ</Text>
                    <Text style={styles.time}>
                      {formatTime(trip.train.departure.time)}
                    </Text>
                    <Text style={styles.stationName}>{trip.train.departure.station.name}</Text>
                    <Text style={styles.platformText}>Voie {trip.train.departure.platform}</Text>
                  </View>
                  <View style={styles.durationContainer}>
                    <View style={styles.timeLine}>
                      <View style={styles.timeDot} />
                      <View style={styles.timeLineBar} />
                      <Ionicons name="train" size={14} color={Colors.primary} />
                      <View style={styles.timeLineBar} />
                      <View style={[styles.timeDot, styles.timeDotFilled]} />
                    </View>
                    <Text style={styles.durationText}>
                      {Math.floor(trip.train.duration / 60)}h{trip.train.duration % 60 > 0 ? String(trip.train.duration % 60).padStart(2, '0') : ''}
                    </Text>
                  </View>
                  <View style={[styles.timeBlock, styles.timeBlockRight]}>
                    <Text style={styles.timeLabel}>Arrivée</Text>
                    <Text style={styles.time}>
                      {formatTime(trip.train.arrival.time)}
                    </Text>
                    <Text style={styles.stationName}>{trip.train.arrival.station.name}</Text>
                  </View>
                </View>

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Ionicons name="train-outline" size={18} color={Colors.primary} />
                    <Text style={styles.detailLabel}>Train</Text>
                    <Text style={styles.detailValue}>{trip.train.trainNumber}</Text>
                  </View>
                  {trip.coach && (
                    <View style={styles.detailItem}>
                      <Ionicons name="cube-outline" size={18} color={Colors.primary} />
                      <Text style={styles.detailLabel}>Voiture</Text>
                      <Text style={styles.detailValue}>{trip.coach}</Text>
                    </View>
                  )}
                  {trip.seat && (
                    <View style={styles.detailItem}>
                      <Ionicons name="person-outline" size={18} color={Colors.primary} />
                      <Text style={styles.detailLabel}>Place</Text>
                      <Text style={styles.detailValue}>{trip.seat}</Text>
                    </View>
                  )}
                  <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={18} color={Colors.primary} />
                    <Text style={styles.detailLabel}>Passagers</Text>
                    <Text style={styles.detailValue}>{trip.passengers || 1}</Text>
                  </View>
                </View>

                {/* Ticket Code */}
                {trip.ticketCode && trip.status !== 'completed' && (
                  <View style={styles.ticketContainer}>
                    <View style={styles.ticketContent}>
                      <View style={styles.qrPlaceholder}>
                        <Ionicons name="qr-code" size={32} color={Colors.primary} />
                      </View>
                      <View style={styles.ticketInfo}>
                        <Text style={styles.ticketLabel}>Code billet</Text>
                        <Text style={styles.ticketCode}>{trip.ticketCode}</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Quick Actions */}
                {trip.status === 'upcoming' && (
                  <View style={styles.quickActions}>
                    <Pressable
                      style={styles.quickAction}
                      onPress={() => handleQuickAction('Téléchargement')}
                    >
                      <Ionicons name="download-outline" size={18} color={Colors.primary} />
                      <Text style={styles.quickActionText}>Télécharger</Text>
                    </Pressable>
                    <Pressable
                      style={styles.quickAction}
                      onPress={() => handleQuickAction('Partage')}
                    >
                      <Ionicons name="share-outline" size={18} color={Colors.primary} />
                      <Text style={styles.quickActionText}>Partager</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.quickAction, styles.quickActionWarning]}
                      onPress={() => handleQuickAction('Modification')}
                    >
                      <Ionicons name="create-outline" size={18} color={Colors.warning} />
                      <Text style={[styles.quickActionText, { color: Colors.warning }]}>Modifier</Text>
                    </Pressable>
                  </View>
                )}
              </Animated.View>
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
    marginTop: 20,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
  compactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTime: {
    ...Typography.bodyBold,
    color: Colors.navy,
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
  expandedContent: {
    gap: Spacing.md,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  timesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  stationName: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  platformText: {
    ...Typography.smallBold,
    color: Colors.primary,
    marginTop: 2,
  },
  durationContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.lg,
  },
  timeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  timeDotFilled: {
    backgroundColor: Colors.primary,
  },
  timeLineBar: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.divider,
  },
  durationText: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  detailLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  detailValue: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    marginLeft: 'auto',
  },
  ticketContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderStyle: 'dashed',
  },
  ticketContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  qrPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: Colors.cardBackground,
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
    ...Typography.h3,
    color: Colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.aiGlow,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  quickActionWarning: {
    backgroundColor: Colors.warningLight,
  },
  quickActionText: {
    ...Typography.smallBold,
    color: Colors.primary,
  },
  bottomSpacer: {
    height: 120,
  },
});
