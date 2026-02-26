import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { OccupancyGauge } from './OccupancyGauge';
import { Train } from '../services/types';
import { formatDuration, formatTime } from '../services/navitia';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface TrainCardProps {
  train: Train;
  onPress?: () => void;
  showRecommendation?: boolean;
  delay?: number;
  compact?: boolean;
}

export function TrainCard({
  train,
  onPress,
  showRecommendation = true,
  delay = 0,
  compact = false,
}: TrainCardProps) {
  const getPriceColor = () => {
    if (train.price <= 29) return Colors.priceGreen;
    if (train.price <= 55) return Colors.priceOrange;
    return Colors.priceRed;
  };

  const getPriceLabel = () => {
    if (train.priceRecommendation === 'buy_now') return 'Acheter maintenant';
    if (train.priceRecommendation === 'wait') return 'Attendre';
    return null;
  };

  return (
    <Animated.View entering={FadeInRight.delay(delay).duration(300)}>
      <GlassCard onPress={onPress} animated={false}>
        <View style={styles.container}>
          {/* Top row: Train number and recommendation */}
          <View style={styles.topRow}>
            <View style={styles.trainInfo}>
              <Text style={styles.trainNumber}>{train.trainNumber}</Text>
              {train.isRecommended && showRecommendation && (
                <LinearGradient
                  colors={[Colors.primaryStart, Colors.primaryEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.recommendedBadge}
                >
                  <Ionicons name="star" size={10} color="#fff" />
                  <Text style={styles.recommendedText}>Recommandé</Text>
                </LinearGradient>
              )}
            </View>
            <OccupancyGauge level={train.occupancy} />
          </View>

          {/* Main content: Times and route */}
          <View style={styles.mainContent}>
            <View style={styles.timeBlock}>
              <Text style={styles.time}>{formatTime(train.departure.time)}</Text>
              <Text style={styles.station} numberOfLines={1}>
                {compact ? train.departure.station.code : train.departure.station.city}
              </Text>
              {train.departure.platform && !compact && (
                <Text style={styles.platform}>Voie {train.departure.platform}</Text>
              )}
            </View>

            <View style={styles.journeyLine}>
              <View style={styles.dot} />
              <View style={styles.line} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{formatDuration(train.duration)}</Text>
              </View>
              <View style={styles.line} />
              <Ionicons name="train" size={16} color={Colors.primaryEnd} />
            </View>

            <View style={[styles.timeBlock, styles.timeBlockRight]}>
              <Text style={styles.time}>{formatTime(train.arrival.time)}</Text>
              <Text style={styles.station} numberOfLines={1}>
                {compact ? train.arrival.station.code : train.arrival.station.city}
              </Text>
              {train.arrival.platform && !compact && (
                <Text style={styles.platform}>Voie {train.arrival.platform}</Text>
              )}
            </View>
          </View>

          {/* Bottom row: Price and action */}
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: getPriceColor() }]}>
                {train.price}€
              </Text>
              {train.originalPrice && train.originalPrice > train.price && (
                <Text style={styles.originalPrice}>{train.originalPrice}€</Text>
              )}
            </View>

            {train.priceRecommendation && getPriceLabel() && (
              <View
                style={[
                  styles.priceBadge,
                  {
                    backgroundColor:
                      train.priceRecommendation === 'buy_now'
                        ? Colors.success + '20'
                        : Colors.warning + '20',
                  },
                ]}
              >
                <Ionicons
                  name={
                    train.priceRecommendation === 'buy_now'
                      ? 'checkmark-circle'
                      : 'time'
                  }
                  size={14}
                  color={
                    train.priceRecommendation === 'buy_now'
                      ? Colors.success
                      : Colors.warning
                  }
                />
                <Text
                  style={[
                    styles.priceBadgeText,
                    {
                      color:
                        train.priceRecommendation === 'buy_now'
                          ? Colors.success
                          : Colors.warning,
                    },
                  ]}
                >
                  {getPriceLabel()}
                </Text>
              </View>
            )}

            {!compact && (
              <View style={styles.amenities}>
                {train.amenities.includes('wifi') && (
                  <Ionicons
                    name="wifi"
                    size={14}
                    color={Colors.textMuted}
                    style={styles.amenityIcon}
                  />
                )}
                {train.amenities.includes('power') && (
                  <Ionicons
                    name="flash"
                    size={14}
                    color={Colors.textMuted}
                    style={styles.amenityIcon}
                  />
                )}
                {train.amenities.includes('bar') && (
                  <Ionicons
                    name="restaurant"
                    size={14}
                    color={Colors.textMuted}
                    style={styles.amenityIcon}
                  />
                )}
                {train.amenities.includes('quiet') && (
                  <Ionicons
                    name="volume-mute"
                    size={14}
                    color={Colors.textMuted}
                    style={styles.amenityIcon}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trainNumber: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  recommendedText: {
    ...Typography.small,
    color: '#fff',
    fontWeight: '600',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  timeBlock: {
    flex: 1,
  },
  timeBlockRight: {
    alignItems: 'flex-end',
  },
  time: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  station: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  platform: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  journeyLine: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryEnd,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.glassBorder,
  },
  durationBadge: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginHorizontal: 4,
  },
  durationText: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  price: {
    ...Typography.h2,
    fontWeight: '700',
  },
  originalPrice: {
    ...Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  priceBadgeText: {
    ...Typography.small,
    fontWeight: '600',
  },
  amenities: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  amenityIcon: {
    marginLeft: 2,
  },
});
