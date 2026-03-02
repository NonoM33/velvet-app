/**
 * TrainCard Component
 * Premium train result card with AI scoring and animations
 */
import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { OccupancyGauge } from './OccupancyGauge';
import { Train } from '../services/types';
import { formatDuration, formatTime } from '../services/navitia';
import { Colors, Spacing, Typography, BorderRadius, Shadows, Motion } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, Motion.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Motion.spring.snappy);
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const getPriceColor = () => {
    if (train.price <= 29) return Colors.priceExcellent;
    if (train.price <= 55) return Colors.priceHigh;
    return Colors.priceVeryHigh;
  };

  const getPriceLabel = () => {
    if (train.priceRecommendation === 'buy_now') return 'Réserver maintenant';
    if (train.priceRecommendation === 'wait') return 'Prix va baisser';
    return null;
  };

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
    <Animated.View entering={FadeInRight.delay(delay).duration(300).springify()}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.cardContainer, animatedStyle]}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.trainMeta}>
            <Text style={styles.trainNumber}>{train.trainNumber}</Text>
            {train.isRecommended && showRecommendation && (
              <View style={styles.recommendedBadge}>
                <Ionicons name="sparkles" size={10} color={Colors.primary} />
                <Text style={styles.recommendedText}>Recommandé</Text>
              </View>
            )}
          </View>

          <View style={styles.indicators}>
            <View style={styles.aiScoreBadge}>
              <Text style={styles.aiScoreValue}>{aiScore}</Text>
              <Text style={styles.aiScoreLabel}>Score</Text>
            </View>
            <OccupancyGauge level={train.occupancy} />
          </View>
        </View>

        {/* Journey Timeline */}
        <View style={styles.journeyRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.time}>{formatTime(train.departure.time)}</Text>
            <Text style={styles.station} numberOfLines={1}>
              {compact ? train.departure.station.code : train.departure.station.city}
            </Text>
            {train.departure.platform && !compact && (
              <Text style={styles.platform}>Voie {train.departure.platform}</Text>
            )}
          </View>

          <View style={styles.timeline}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineLine}>
              <View style={styles.durationPill}>
                <Text style={styles.durationText}>{formatDuration(train.duration)}</Text>
              </View>
            </View>
            <View style={styles.trainIconWrapper}>
              <Ionicons name="train" size={14} color={Colors.primary} />
            </View>
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

        {/* Footer Row */}
        <View style={styles.footerRow}>
          <View style={styles.priceSection}>
            <View style={styles.priceDisplay}>
              {train.originalPrice && train.originalPrice > train.price && (
                <Text style={styles.originalPrice}>{train.originalPrice}€</Text>
              )}
              <Text style={[styles.price, { color: getPriceColor() }]}>
                {train.price}€
              </Text>
            </View>

            {train.priceRecommendation && getPriceLabel() && (
              <View
                style={[
                  styles.priceBadge,
                  {
                    backgroundColor:
                      train.priceRecommendation === 'buy_now'
                        ? Colors.successMuted
                        : Colors.warningMuted,
                  },
                ]}
              >
                <Ionicons
                  name={train.priceRecommendation === 'buy_now' ? 'checkmark-circle' : 'time-outline'}
                  size={12}
                  color={train.priceRecommendation === 'buy_now' ? Colors.success : Colors.warning}
                />
                <Text
                  style={[
                    styles.priceBadgeText,
                    { color: train.priceRecommendation === 'buy_now' ? Colors.success : Colors.warning },
                  ]}
                >
                  {getPriceLabel()}
                </Text>
              </View>
            )}
          </View>

          {!compact && (
            <View style={styles.amenities}>
              {train.amenities.includes('wifi') && (
                <View style={styles.amenityIcon}>
                  <Ionicons name="wifi" size={14} color={Colors.textTertiary} />
                </View>
              )}
              {train.amenities.includes('power') && (
                <View style={styles.amenityIcon}>
                  <Ionicons name="flash" size={14} color={Colors.textTertiary} />
                </View>
              )}
              {train.amenities.includes('bar') && (
                <View style={styles.amenityIcon}>
                  <Ionicons name="restaurant" size={14} color={Colors.textTertiary} />
                </View>
              )}
              {train.amenities.includes('quiet') && (
                <View style={styles.amenityIcon}>
                  <Ionicons name="volume-mute" size={14} color={Colors.textTertiary} />
                </View>
              )}
            </View>
          )}

          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.smd,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trainNumber: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryGhost,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  recommendedText: {
    ...Typography.micro,
    color: Colors.primary,
    fontWeight: '600',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aiScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primaryGhost,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  aiScoreValue: {
    ...Typography.footnoteMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  aiScoreLabel: {
    ...Typography.micro,
    color: Colors.primary,
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
  },
  timeBlockRight: {
    alignItems: 'flex-end',
  },
  time: {
    ...Typography.h3,
    color: Colors.navy,
    fontWeight: '700',
  },
  station: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  platform: {
    ...Typography.footnote,
    color: Colors.textMuted,
    marginTop: 2,
  },
  timeline: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.neutral200,
    position: 'relative',
    marginHorizontal: 4,
  },
  durationPill: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -24 }],
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    ...Typography.micro,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  trainIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.smd,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  priceSection: {
    flex: 1,
    gap: Spacing.xs,
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  originalPrice: {
    ...Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  priceBadgeText: {
    ...Typography.micro,
    fontWeight: '600',
  },
  amenities: {
    flexDirection: 'row',
    gap: 6,
    marginRight: Spacing.sm,
  },
  amenityIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
