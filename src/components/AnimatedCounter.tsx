import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  useAnimatedProps,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Typography } from '../constants/theme';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: TextStyle;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  prefix = '',
  suffix = '',
  style,
  decimals = 0,
}: AnimatedCounterProps) {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration });
  }, [value, duration]);

  // Update display value on JS thread
  useEffect(() => {
    const interval = setInterval(() => {
      const current = animatedValue.value;
      setDisplayValue(current);
      if (Math.abs(current - value) < 0.1) {
        clearInterval(interval);
        setDisplayValue(value);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [value]);

  const formattedValue =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString('fr-FR');

  return (
    <Text style={[styles.text, style]}>
      {prefix}
      {formattedValue}
      {suffix}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
