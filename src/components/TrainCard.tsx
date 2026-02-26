import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { OccupancyGauge } from './OccupancyGauge';
import { Train } from '../services/types';
import { formatDuration, formatTime } from '../services/navitia';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';

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
    if (train.priceRecommendation === 'wait') return 'Prix va baisser ↓';
    return null;
  };

  // AI Score calculation (simplified demo)
  const getAIScore = () => {
    let score = 70;
    if (train.price <= 29) score += 20;
    else if (train.price <= 45) score += 10;
    if (train.priceRecommendation === 'buy_now') score += 10;
    if (train.occupancy === 'low') score += 5;
    return Math.min(score, 100);
  };

  const aiScore = getAIScore();

  return (
    <Animated.View entering={FadeInRight.delay(delay).duration(300)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardContainer,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.container}>
          {/* Top row: Train number, AI badge, and occupancy */}
          <View style={styles.topRow}>
            <View style={styles.trainInfo}>
              <Text style={styles.trainNumber}>{train.trainNumber}</Text>
              {train.isRecommended && showRecommendation && (
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.recommendedBadge}
                >
                  <Ionicons name="sparkles" size={10} color="#fff" />
                  <Text style={styles.recommendedText}>IA recommande</Text>
                </LinearGradient>
              )}
            </View>
            <View style={styles.scoreAndOccupancy}>
              <View style={styles.aiScoreBadge}>
                <Text style={styles.aiScoreText}>{aiScore}</Text>
                <Text style={styles.aiScoreLabel}>Score IA</Text>
              </View>
              <OccupancyGauge level={train.occupancy} />
            </View>
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
              <Ionicons name="train" size={16} color={Colors.primary} />
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

          {/* Bottom row: Price and AI recommendation */}
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
                        ? Colors.successLight
                        : Colors.warningLight,
                  },
                ]}
              >
                <Ionicons
                  name={
                    train.priceRecommendation === 'buy_now'
                      ? 'checkmark-circle'
                      : 'trending-down'
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
                  <View style={styles.amenityBadge}>
                    <Ionicons name="wifi" size={12} color={Colors.textMuted} />
                  </View>
                )}
                {train.amenities.includes('power') && (
                  <View style={styles.amenityBadge}>
                    <Ionicons name="flash" size={12} color={Colors.textMuted} />
                  </View>
                )}
                {train.amenities.includes('bar') && (
                  <View style={styles.amenityBadge}>
                    <Ionicons name="restaurant" size={12} color={Colors.textMuted} />
                  </View>
                )}
                {train.amenities.includes('quiet') && (
                  <View style={styles.amenityBadge}>
                    <Ionicons name="volume-mute" size={12} color={Colors.textMuted} />
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
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
    fontWeight: '500',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  recommendedText: {
    ...Typography.small,
    color: '#fff',
    fontWeight: '600',
  },
  scoreAndOccupancy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aiScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.aiGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  aiScoreText: {
    ...Typography.smallBold,
    color: Colors.primary,
  },
  aiScoreLabel: {
    ...Typography.small,
    color: Colors.primary,
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
    backgroundColor: Colors.primary,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.divider,
  },
  durationBadge: {
    backgroundColor: Colors.backgroundTertiary,
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
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
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
    gap: 4,
  },
  amenityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
