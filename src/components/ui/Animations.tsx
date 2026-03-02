/**
 * Animation Primitives
 * Reusable animated components for micro-interactions
 */
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  interpolate,
  Easing,
  SharedValue,
  cancelAnimation,
} from 'react-native-reanimated';
import { Colors, Motion } from '../../constants/theme';

// ============= PULSING DOT =============
interface PulsingDotProps {
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export function PulsingDot({
  color = Colors.success,
  size = 8,
  style,
}: PulsingDotProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 600, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.in(Easing.ease) })
      ),
      -1,
      true
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.pulsingDot,
        { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ============= SPARKLE =============
interface SparkleProps {
  color?: string;
  size?: number;
  delay?: number;
  style?: ViewStyle;
}

export function Sparkle({
  color = Colors.primary,
  size = 12,
  delay = 0,
  style,
}: SparkleProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.out(Easing.back(2)) }),
          withTiming(0.8, { duration: 200 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      )
    );

    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(180, { duration: 900, easing: Easing.linear }),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 200 })
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotation);
      cancelAnimation(opacity);
    };
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.sparkle, { width: size, height: size }, animatedStyle, style]}>
      <View style={[styles.sparkleArm, styles.sparkleArmH, { backgroundColor: color }]} />
      <View style={[styles.sparkleArm, styles.sparkleArmV, { backgroundColor: color }]} />
    </Animated.View>
  );
}

// ============= SHIMMER =============
interface ShimmerProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Shimmer({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}: ShimmerProps) {
  const translateX = useSharedValue(-100);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(100, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` as any }],
  }));

  return (
    <View
      style={[
        styles.shimmerContainer,
        { width: width as any, height, borderRadius },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmerHighlight, animatedStyle]} />
    </View>
  );
}

// ============= BOUNCE IN =============
interface BounceInProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export function BounceIn({ children, delay = 0, style }: BounceInProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, Motion.spring.bouncy)
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: Motion.duration.fast })
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

// ============= SLIDE IN =============
type SlideDirection = 'left' | 'right' | 'up' | 'down';

interface SlideInProps {
  children: React.ReactNode;
  direction?: SlideDirection;
  distance?: number;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export function SlideIn({
  children,
  direction = 'up',
  distance = 20,
  delay = 0,
  duration = Motion.duration.normal,
  style,
}: SlideInProps) {
  const translateX = useSharedValue(
    direction === 'left' ? -distance : direction === 'right' ? distance : 0
  );
  const translateY = useSharedValue(
    direction === 'up' ? distance : direction === 'down' ? -distance : 0
  );
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withSpring(0, Motion.spring.default)
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, Motion.spring.default)
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration })
    );

    return () => {
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, [delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

// ============= TYPING INDICATOR =============
interface TypingIndicatorProps {
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export function TypingIndicator({
  color = Colors.textMuted,
  size = 6,
  style,
}: TypingIndicatorProps) {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const animateDot = (dot: SharedValue<number>, delay: number) => {
      dot.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 300, easing: Easing.ease }),
            withTiming(0, { duration: 300, easing: Easing.ease })
          ),
          -1,
          true
        )
      );
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);

    return () => {
      cancelAnimation(dot1);
      cancelAnimation(dot2);
      cancelAnimation(dot3);
    };
  }, []);

  const createDotStyle = (dot: SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: interpolate(dot.value, [0, 1], [0, -4]) }],
      opacity: interpolate(dot.value, [0, 1], [0.4, 1]),
    }));

  const dot1Style = createDotStyle(dot1);
  const dot2Style = createDotStyle(dot2);
  const dot3Style = createDotStyle(dot3);

  return (
    <View style={[styles.typingContainer, style]}>
      <Animated.View
        style={[
          styles.typingDot,
          { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
          dot1Style,
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
          dot2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
          dot3Style,
        ]}
      />
    </View>
  );
}

// ============= PROGRESS BAR =============
interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color = Colors.primary,
  backgroundColor = Colors.neutral200,
  height = 4,
  animated = true,
  style,
}: ProgressBarProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withSpring(progress, Motion.spring.default);
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  return (
    <View
      style={[
        styles.progressContainer,
        { backgroundColor, height, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progressBar,
          { backgroundColor: color, borderRadius: height / 2 },
          progressStyle,
        ]}
      />
    </View>
  );
}

// ============= SPINNER =============
interface SpinnerProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: ViewStyle;
}

export function Spinner({
  size = 24,
  color = Colors.primary,
  strokeWidth = 2,
  style,
}: SpinnerProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );

    return () => {
      cancelAnimation(rotation);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          width: size,
          height: size,
          borderWidth: strokeWidth,
          borderColor: Colors.neutral200,
          borderTopColor: color,
          borderRadius: size / 2,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  pulsingDot: {},
  sparkle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleArm: {
    position: 'absolute',
    borderRadius: 1,
  },
  sparkleArmH: {
    width: '100%',
    height: 2,
  },
  sparkleArmV: {
    width: 2,
    height: '100%',
  },
  shimmerContainer: {
    backgroundColor: Colors.neutral200,
    overflow: 'hidden',
  },
  shimmerHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {},
  progressContainer: {
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  spinner: {
    borderStyle: 'solid',
  },
});
