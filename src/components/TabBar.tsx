import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';

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
  const activeValue = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    activeValue.value = withSpring(isActive ? 1 : 0, { damping: 15 });
  }, [isActive]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(activeValue.value, [0, 1], [1, 1.1]),
      },
      {
        translateY: interpolate(activeValue.value, [0, 1], [0, -2]),
      },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.tabContent, containerStyle]}>
        {isActive ? (
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeBackground}
          >
            <Animated.View style={iconAnimatedStyle}>
              <Ionicons name={tab.icon} size={20} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.activeLabel}>{tab.label}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.inactiveContent}>
            <Ionicons name={`${tab.icon}-outline` as any} size={20} color={Colors.textMuted} />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingHorizontal: Spacing.md,
  },
  tabBarContainer: {
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.cardBackground,
    ...Shadows.large,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
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
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  activeLabel: {
    ...Typography.small,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inactiveContent: {
    padding: Spacing.sm,
  },
});
