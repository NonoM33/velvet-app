/**
 * TabBar Component
 * Premium custom tab bar with smooth animations
 */
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, BorderRadius, Shadows, Motion } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    navigate: (name: string) => void;
  };
}

const tabs = [
  { name: 'index', label: 'Accueil', icon: 'home' as const },
  { name: 'chat', label: 'Assistant', icon: 'chatbubble' as const },
  { name: 'trips', label: 'Voyages', icon: 'ticket' as const },
  { name: 'profile', label: 'Profil', icon: 'person' as const },
];

export function TabBar({ state, navigation }: TabBarProps) {
  return (
    <View style={styles.container}>
      {/* Blur background for iOS */}
      {Platform.OS === 'ios' && (
        <BlurView intensity={80} tint="light" style={styles.blur} />
      )}

      <View style={styles.tabBarContainer}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <TabButton
              key={tab.name}
              tab={tab}
              isActive={state.index === index}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                navigation.navigate(tab.name);
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

interface TabButtonProps {
  tab: { name: string; label: string; icon: 'home' | 'chatbubble' | 'ticket' | 'person' };
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ tab, isActive, onPress }: TabButtonProps) {
  const scale = useSharedValue(1);
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  const labelWidth = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    activeProgress.value = withSpring(isActive ? 1 : 0, Motion.spring.snappy);
    labelWidth.value = withTiming(isActive ? 1 : 0, {
      duration: Motion.duration.fast,
      easing: Easing.out(Easing.ease),
    });
  }, [isActive]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(activeProgress.value, [0, 1], [1, 1.15]) },
      { translateY: interpolate(activeProgress.value, [0, 1], [0, -1]) },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(labelWidth.value, [0, 0.5, 1], [0, 0, 1]),
    transform: [
      { translateX: interpolate(labelWidth.value, [0, 1], [-4, 0]) },
    ],
    maxWidth: interpolate(labelWidth.value, [0, 1], [0, 80]),
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: activeProgress.value,
    transform: [
      { scale: interpolate(activeProgress.value, [0, 1], [0.8, 1]) },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, Motion.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Motion.spring.snappy);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.tabButton, containerStyle]}
    >
      {/* Active Background */}
      <Animated.View style={[styles.activeBackgroundWrapper, backgroundStyle]}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activeBackground}
        />
      </Animated.View>

      {/* Content */}
      <View style={styles.tabContent}>
        <Animated.View style={iconStyle}>
          <Ionicons
            name={isActive ? tab.icon : (`${tab.icon}-outline` as any)}
            size={22}
            color={isActive ? '#FFFFFF' : Colors.textTertiary}
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.tabLabel,
            isActive ? styles.tabLabelActive : styles.tabLabelInactive,
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {tab.label}
        </Animated.Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingHorizontal: Spacing.md,
  },
  blur: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarContainer: {
    borderRadius: BorderRadius.xxl,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : Colors.surface,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    position: 'relative',
  },
  activeBackgroundWrapper: {
    position: 'absolute',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  activeBackground: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.smd,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.smd,
    paddingVertical: Spacing.sm,
    zIndex: 1,
  },
  tabLabel: {
    fontWeight: '600',
    overflow: 'hidden',
  },
  tabLabelActive: {
    ...Typography.captionMedium,
    color: '#FFFFFF',
  },
  tabLabelInactive: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});
