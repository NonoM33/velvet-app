/**
 * Skeleton Loader Component
 * Premium shimmer effect for loading states
 */
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Motion } from '../../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius,
  style,
  variant = 'rounded',
}: SkeletonProps) {
  const shimmerPosition = useSharedValue(-1);

  useEffect(() => {
    shimmerPosition.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmerPosition.value,
          [-1, 1],
          [-200, 200]
        ),
      },
    ],
  }));

  const getRadius = () => {
    if (borderRadius !== undefined) return borderRadius;
    switch (variant) {
      case 'text':
        return BorderRadius.xs;
      case 'circular':
        return 9999;
      case 'rectangular':
        return 0;
      case 'rounded':
      default:
        return BorderRadius.sm;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: width as any,
          height,
          borderRadius: getRadius(),
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.4)',
            'transparent',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

// Preset skeleton configurations
export function SkeletonText({ lines = 1, lastLineWidth = '60%' }: { lines?: number; lastLineWidth?: string }) {
  return (
    <View style={styles.textContainer}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height={14}
          variant="text"
          style={index < lines - 1 ? styles.textLine : undefined}
        />
      ))}
    </View>
  );
}

export function SkeletonAvatar({ size = 48 }: { size?: number }) {
  return <Skeleton width={size} height={size} variant="circular" />;
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <SkeletonAvatar size={40} />
        <View style={styles.cardHeaderText}>
          <Skeleton width="70%" height={14} variant="text" />
          <Skeleton width="40%" height={12} variant="text" style={{ marginTop: 6 }} />
        </View>
      </View>
      <SkeletonText lines={3} lastLineWidth="80%" />
    </View>
  );
}

export function SkeletonTrainCard() {
  return (
    <View style={styles.trainCard}>
      <View style={styles.trainCardRow}>
        <View style={styles.trainTimeSection}>
          <Skeleton width={50} height={20} variant="text" />
          <Skeleton width={30} height={12} variant="text" style={{ marginTop: 4 }} />
        </View>
        <View style={styles.trainRouteSection}>
          <Skeleton width={120} height={14} variant="text" />
          <Skeleton width={80} height={12} variant="text" style={{ marginTop: 4 }} />
        </View>
        <View style={styles.trainPriceSection}>
          <Skeleton width={40} height={20} variant="text" />
        </View>
      </View>
      <View style={styles.trainCardFooter}>
        <Skeleton width={60} height={24} variant="rounded" />
        <Skeleton width={60} height={24} variant="rounded" />
        <Skeleton width={60} height={24} variant="rounded" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral200,
    overflow: 'hidden',
  },
  shimmer: {
    width: 200,
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    flex: 1,
  },
  textContainer: {
    gap: 8,
  },
  textLine: {
    marginBottom: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  trainCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    gap: 12,
  },
  trainCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainTimeSection: {
    marginRight: 16,
  },
  trainRouteSection: {
    flex: 1,
  },
  trainPriceSection: {
    alignItems: 'flex-end',
  },
  trainCardFooter: {
    flexDirection: 'row',
    gap: 8,
  },
});
