/**
 * NextTripCard Component
 * Expandable card showing next upcoming trip details
 */
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Spacing, Shadows, Motion } from '../../constants/theme';
import { formatTime } from '../../services/navitia';
import type { Weather, Trip } from '../../services/types';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  isToday: boolean;
  isTomorrow: boolean;
}

interface NextTripCardProps {
  trip: Trip;
  countdown: CountdownData | null;
  weather: Weather | null;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export function NextTripCard({
  trip,
  countdown,
  weather,
  expanded,
  onToggleExpanded,
}: NextTripCardProps) {
  const chevronRotation = useSharedValue(0);

  useEffect(() => {
    chevronRotation.value = withSpring(expanded ? 180 : 0, Motion.spring.snappy);
  }, [expanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onToggleExpanded();
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.card}>
        {/* Compact Header */}
        <View style={styles.compactView}>
          <View style={styles.mainInfo}>
            <Text style={styles.routeText}>
              {trip?.train?.departure?.station?.city ?? '—'} → {trip?.train?.arrival?.station?.city ?? '—'}
            </Text>
            {countdown && <CountdownBadge countdown={countdown} />}
          </View>

          <View style={styles.quickInfo}>
            <InfoChip
              icon="location"
              text={`Voie ${trip?.train?.departure?.platform ?? '—'}`}
            />
            <InfoChip
              icon="person"
              text={`Place ${trip.seat}`}
            />
            {weather && (
              <View style={styles.weatherChip}>
                <Text style={styles.weatherIcon}>{weather.icon}</Text>
                <Text style={styles.weatherTemp}>{weather.temperature}°</Text>
              </View>
            )}
          </View>
        </View>

        {/* Expanded Details */}
        {expanded && (
          <Animated.View
            entering={FadeInDown.duration(200).springify()}
            style={styles.expandedView}
          >
            <View style={styles.divider} />

            {/* Timeline */}
            <View style={styles.timeline}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>Départ</Text>
                <Text style={styles.timeValue}>{formatTime(trip.train.departure.time)}</Text>
                <Text style={styles.stationName}>{trip.train.departure.station.name}</Text>
              </View>

              <View style={styles.timelinePath}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineLine} />
                <View style={styles.trainIconWrapper}>
                  <Ionicons name="train" size={14} color={Colors.primary} />
                </View>
                <View style={styles.timelineLine} />
                <View style={[styles.timelineDot, styles.timelineDotFilled]} />
              </View>

              <View style={[styles.timeBlock, styles.timeBlockRight]}>
                <Text style={styles.timeLabel}>Arrivée</Text>
                <Text style={styles.timeValue}>{formatTime(trip.train.arrival.time)}</Text>
                <Text style={styles.stationName}>{trip.train.arrival.station.name}</Text>
              </View>
            </View>

            {/* Trip Details */}
            <View style={styles.detailsRow}>
              <DetailItem icon="train-outline" text={trip.train.trainNumber} />
              <DetailItem icon="cube-outline" text={`Voiture ${trip.coach}`} />
              <DetailItem icon="qr-code-outline" text={trip.ticketCode} />
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <Pressable style={styles.actionButton}>
                <Ionicons name="download-outline" size={18} color={Colors.primary} />
                <Text style={styles.actionText}>Billet</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="share-outline" size={18} color={Colors.primary} />
                <Text style={styles.actionText}>Partager</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
                <Text style={styles.actionText}>Alerte</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* Expand Indicator */}
        <Animated.View style={[styles.expandIndicator, chevronStyle]}>
          <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

// Countdown Badge
function CountdownBadge({ countdown }: { countdown: CountdownData }) {
  const getCountdownText = () => {
    if (countdown.isToday) {
      return `${countdown.hours}h ${countdown.minutes}m`;
    }
    if (countdown.isTomorrow) {
      return 'Demain';
    }
    return `${countdown.days}j`;
  };

  const isUrgent = countdown.isToday && countdown.hours < 2;

  return (
    <View style={[styles.countdownBadge, isUrgent && styles.countdownUrgent]}>
      <Ionicons name="time" size={12} color="#FFF" />
      <Text style={styles.countdownText}>{getCountdownText()}</Text>
    </View>
  );
}

// Info Chip
function InfoChip({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.infoChip}>
      <Ionicons name={icon} size={13} color={Colors.primary} />
      <Text style={styles.infoChipText}>{text}</Text>
    </View>
  );
}

// Detail Item
function DetailItem({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.detailItem}>
      <Ionicons name={icon} size={15} color={Colors.textTertiary} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactView: {
    gap: Spacing.smd,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
  },
  quickInfo: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  infoChipText: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  weatherChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  weatherIcon: {
    fontSize: 13,
  },
  weatherTemp: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  countdownUrgent: {
    backgroundColor: Colors.error,
  },
  countdownText: {
    ...Typography.footnoteMedium,
    color: '#FFF',
  },
  expandedView: {
    gap: Spacing.md,
    marginTop: Spacing.smd,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
  },
  timeBlockRight: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    ...Typography.footnote,
    color: Colors.textMuted,
  },
  timeValue: {
    ...Typography.h2,
    color: Colors.navy,
  },
  stationName: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  timelinePath: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.smd,
    gap: 4,
    flex: 0.8,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  timelineDotFilled: {
    backgroundColor: Colors.primary,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.neutral200,
  },
  trainIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.smd,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.primaryGhost,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  actionText: {
    ...Typography.captionMedium,
    color: Colors.primary,
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
});
