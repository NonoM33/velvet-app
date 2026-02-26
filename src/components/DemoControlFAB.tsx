import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store/store';
import { demoScenarios } from '../services/demoData';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

export const DemoControlFAB: React.FC = () => {
  const { demoMode, demoScenarioIndex, nextDemoScenario, deactivateDemo } = useStore();

  const scale = useSharedValue(1);

  const handleSkip = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    nextDemoScenario();
  };

  const handleStop = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    deactivateDemo();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!demoMode) return null;

  const currentScenario = demoScenarioIndex + 1;
  const totalScenarios = demoScenarios.length;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <View style={styles.fabContainer}>
        {/* Scenario indicator */}
        <View style={styles.indicator}>
          <Text style={styles.indicatorText}>
            {currentScenario}/{totalScenarios}
          </Text>
        </View>

        {/* Control buttons */}
        <Animated.View style={[styles.controls, animatedStyle]}>
          {/* Skip button */}
          <Pressable
            style={styles.controlButton}
            onPress={handleSkip}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.controlGradient}
            >
              <Ionicons name="play-skip-forward" size={20} color="#FFF" />
            </LinearGradient>
          </Pressable>

          {/* Stop button */}
          <Pressable
            style={styles.controlButton}
            onPress={handleStop}
          >
            <View style={styles.stopButton}>
              <Ionicons name="stop" size={20} color={Colors.error} />
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.md,
    zIndex: 9998,
  },
  fabContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  indicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  indicatorText: {
    ...Typography.smallBold,
    color: '#FFF',
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    ...Shadows.medium,
  },
  controlButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  controlGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
  },
  stopButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.full,
  },
});
