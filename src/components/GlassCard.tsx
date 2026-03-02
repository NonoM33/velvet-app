/**
 * GlassCard Component (Legacy wrapper)
 * Use Card from ./ui/Card.tsx for new components
 */
import React from 'react';
import { StyleSheet, View, ViewStyle, Pressable, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Spacing, Shadows, Motion } from '../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  animated?: boolean;
  delay?: number;
  variant?: 'default' | 'elevated' | 'ai' | 'flat';
  haptic?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassCard({
  children,
  style,
  onPress,
  animated = true,
  delay = 0,
  variant = 'default',
  haptic = true,
}: GlassCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, Motion.spring.snappy);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Motion.spring.snappy);
  };

  const handlePress = () => {
    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          ...Shadows.md,
          backgroundColor: Colors.cardBackground,
          borderWidth: 0,
        };
      case 'ai':
        return {
          ...Shadows.glow,
          backgroundColor: Colors.cardBackground,
          borderWidth: 1,
          borderColor: Colors.primaryGhost,
        };
      case 'flat':
        return {
          backgroundColor: Colors.backgroundSecondary,
          borderWidth: 0,
          ...Shadows.none,
        };
      default:
        return {
          ...Shadows.sm,
          backgroundColor: Colors.cardBackground,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
        };
    }
  };

  const content = (
    <View style={[styles.innerContainer, getVariantStyles(), style]}>
      <View style={styles.content}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
        entering={animated ? FadeInDown.delay(delay).duration(400).springify() : undefined}
      >
        {content}
      </AnimatedPressable>
    );
  }

  if (animated) {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).duration(400).springify()}
        style={animatedStyle}
      >
        {content}
      </Animated.View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  innerContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.md,
  },
});
