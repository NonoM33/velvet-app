import React from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  onPress?: () => void;
  animated?: boolean;
  delay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassCard({
  children,
  style,
  intensity = 20,
  onPress,
  animated = true,
  delay = 0,
}: GlassCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const content = (
    <View style={[styles.innerContainer, style]}>
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
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
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  blur: {
    backgroundColor: Colors.glassBackground,
  },
  content: {
    padding: Spacing.md,
  },
});
