import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface PriceChartProps {
  data: number[];
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
  width?: number;
  height?: number;
}

export function PriceChart({
  data,
  currentPrice,
  trend,
  width = 120,
  height = 40,
}: PriceChartProps) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return Colors.priceRed;
      case 'down':
        return Colors.priceGreen;
      default:
        return Colors.priceOrange;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  const barWidth = (width - (data.length - 1) * 2) / data.length;

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width, height }]}>
        {data.map((value, index) => {
          const barHeight = ((value - minValue) / range) * height * 0.8 + height * 0.2;
          const isLast = index === data.length - 1;

          return (
            <AnimatedBar
              key={index}
              height={barHeight}
              width={barWidth}
              color={isLast ? getTrendColor() : Colors.divider}
              delay={index * 50}
              isLast={isLast}
            />
          );
        })}
      </View>
      <View style={styles.labelContainer}>
        <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
          {getTrendIcon()}
        </Text>
        <Text style={[styles.price, { color: getTrendColor() }]}>
          {currentPrice}€
        </Text>
      </View>
    </View>
  );
}

interface AnimatedBarProps {
  height: number;
  width: number;
  color: string;
  delay: number;
  isLast: boolean;
}

function AnimatedBar({ height, width, color, delay, isLast }: AnimatedBarProps) {
  const animatedHeight = useSharedValue(0);

  React.useEffect(() => {
    animatedHeight.value = withDelay(delay, withSpring(height, { damping: 12 }));
  }, [height, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { width, backgroundColor: color },
        isLast && styles.lastBar,
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    borderRadius: 2,
  },
  lastBar: {
    borderRadius: BorderRadius.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    ...Typography.bodyBold,
  },
});
