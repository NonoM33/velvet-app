import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';
import { Colors, Typography, BorderRadius } from '../constants/theme';

interface OccupancyGaugeProps {
  level: 'low' | 'medium' | 'high';
  showLabel?: boolean;
  size?: 'small' | 'medium';
}

export function OccupancyGauge({
  level,
  showLabel = true,
  size = 'small',
}: OccupancyGaugeProps) {
  const getColor = () => {
    switch (level) {
      case 'low':
        return Colors.occupancyLow;
      case 'medium':
        return Colors.occupancyMedium;
      case 'high':
        return Colors.occupancyHigh;
    }
  };

  const getLabel = () => {
    switch (level) {
      case 'low':
        return 'Peu rempli';
      case 'medium':
        return 'Remplissage moyen';
      case 'high':
        return 'Très rempli';
    }
  };

  const getEmoji = () => {
    switch (level) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🔴';
    }
  };

  const activeBars = level === 'low' ? 1 : level === 'medium' ? 2 : 3;
  const barHeight = size === 'small' ? 12 : 16;
  const barWidth = size === 'small' ? 4 : 6;

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {[1, 2, 3].map((bar) => (
          <Animated.View
            key={bar}
            style={[
              styles.bar,
              {
                height: barHeight,
                width: barWidth,
                backgroundColor:
                  bar <= activeBars ? getColor() : Colors.glassBorder,
              },
            ]}
          />
        ))}
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: getColor() }]}>{getEmoji()}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    borderRadius: 2,
  },
  label: {
    ...Typography.small,
  },
});
