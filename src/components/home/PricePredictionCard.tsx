/**
 * PricePredictionCard Component
 * AI-powered price prediction hero card with animated chart
 */
import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Spacing, Shadows, Motion } from '../../constants/theme';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Chip';
import { PulsingDot } from '../ui/Animations';

interface Route {
  origin: string;
  destination: string;
  price: number;
  originalPrice: number;
  confidence: number;
  daysUntilRise: number;
}

interface PricePredictionCardProps {
  route: Route;
  priceData: number[];
  onBook: () => void;
  onCreateAlert: () => void;
  onChangeRoute: () => void;
}

export function PricePredictionCard({
  route,
  priceData,
  onBook,
  onCreateAlert,
  onChangeRoute,
}: PricePredictionCardProps) {
  const pulseAnim = useSharedValue(1);
  const savings = Math.round((1 - route.price / route.originalPrice) * 100);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const priceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.aiGlow, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onChangeRoute} style={styles.routeSwitcher}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={12} color="#FFF" />
                <Text style={styles.aiBadgeText}>Prix Prédictif</Text>
              </View>
              <View style={styles.switchIndicator}>
                <Ionicons name="swap-horizontal" size={14} color={Colors.primary} />
              </View>
            </Pressable>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>-{savings}%</Text>
            </View>
          </View>

          {/* Route Info */}
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>{route.origin} → {route.destination}</Text>
            <Text style={styles.routeSubtitle}>Meilleur moment pour réserver</Text>
          </View>

          {/* Price Chart */}
          <View style={styles.chartSection}>
            <PriceChart data={priceData} />
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Il y a 12j</Text>
              <View style={styles.bestMomentIndicator}>
                <PulsingDot color={Colors.success} size={6} />
                <Text style={styles.bestMomentText}>Meilleur moment</Text>
              </View>
              <Text style={styles.chartLabel}>Aujourd'hui</Text>
            </View>
          </View>

          {/* Price Display */}
          <View style={styles.priceSection}>
            <Animated.View style={[styles.priceDisplay, priceStyle]}>
              <Text style={styles.originalPrice}>{route.originalPrice}€</Text>
              <Text style={styles.currentPrice}>{route.price}€</Text>
            </Animated.View>
            <View style={styles.confidenceRow}>
              <Ionicons name="analytics" size={14} color={Colors.primary} />
              <Text style={styles.confidenceText}>
                IA {route.confidence}% sûre — prix augmente dans {route.daysUntilRise}j
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <View style={styles.primaryAction}>
              <Button
                title={`Réserver à ${route.price}€`}
                onPress={onBook}
                variant="success"
                size="lg"
                icon="checkmark-circle"
                fullWidth
              />
            </View>
            <Pressable style={styles.alertButton} onPress={onCreateAlert}>
              <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

// Animated Price Chart
function PriceChart({ data }: { data: number[] }) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  return (
    <View style={styles.chartContainer}>
      {data.map((value, index) => {
        const height = ((value - minValue) / range) * 50 + 16;
        const isLast = index === data.length - 1;
        const isBest = value === Math.min(...data);
        return (
          <AnimatedBar
            key={index}
            height={height}
            isLast={isLast}
            isBest={isBest}
            delay={index * 40}
          />
        );
      })}
    </View>
  );
}

function AnimatedBar({
  height,
  isLast,
  isBest,
  delay,
}: {
  height: number;
  isLast: boolean;
  isBest: boolean;
  delay: number;
}) {
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = withSpring(height, {
      ...Motion.spring.default,
      delay,
    } as any);
  }, [height, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  const getBarColor = () => {
    if (isBest) return Colors.success;
    if (isLast) return Colors.primary;
    return Colors.neutral200;
  };

  return (
    <Animated.View
      style={[
        styles.chartBar,
        { backgroundColor: getBarColor() },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  gradientBorder: {
    borderRadius: BorderRadius.xl,
    padding: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl - 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  aiBadgeText: {
    ...Typography.micro,
    color: '#FFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  switchIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsBadge: {
    backgroundColor: Colors.successMuted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  savingsText: {
    ...Typography.bodySemibold,
    color: Colors.success,
  },
  routeInfo: {
    gap: 2,
  },
  routeTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  routeSubtitle: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  chartSection: {
    gap: Spacing.xs,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
    gap: 3,
    paddingTop: Spacing.xs,
  },
  chartBar: {
    flex: 1,
    borderRadius: 3,
    minHeight: 8,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  chartLabel: {
    ...Typography.footnote,
    color: Colors.textMuted,
  },
  bestMomentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  bestMomentText: {
    ...Typography.footnoteMedium,
    color: Colors.success,
  },
  priceSection: {
    gap: Spacing.xs,
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.smd,
  },
  originalPrice: {
    ...Typography.h3,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: -0.5,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  confidenceText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  primaryAction: {
    flex: 1,
  },
  alertButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
