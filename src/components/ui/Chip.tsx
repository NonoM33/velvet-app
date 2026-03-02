/**
 * Chip/Badge Component
 * For filters, tags, and status indicators
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Spacing, Motion } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ChipVariant = 'filled' | 'outlined' | 'ghost' | 'gradient';
type ChipSize = 'sm' | 'md' | 'lg';
type ChipColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface ChipProps {
  label: string;
  onPress?: () => void;
  onRemove?: () => void;
  variant?: ChipVariant;
  size?: ChipSize;
  color?: ChipColor;
  icon?: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Chip({
  label,
  onPress,
  onRemove,
  variant = 'filled',
  size = 'md',
  color = 'primary',
  icon,
  selected = false,
  disabled = false,
  style,
}: ChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.95, Motion.spring.snappy);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Motion.spring.snappy);
  };

  const handlePress = () => {
    if (disabled) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const sizeStyles = getSizeStyles(size);
  const colorStyles = getColorStyles(color, variant, selected);

  const content = (
    <>
      {icon && (
        <Ionicons
          name={icon}
          size={sizeStyles.iconSize}
          color={colorStyles.text.color as string}
          style={styles.icon}
        />
      )}
      <Text
        style={[styles.label, sizeStyles.text, colorStyles.text]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {onRemove && (
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onRemove();
          }}
          style={styles.removeButton}
          hitSlop={8}
        >
          <Ionicons
            name="close"
            size={sizeStyles.iconSize - 2}
            color={colorStyles.text.color as string}
          />
        </Pressable>
      )}
    </>
  );

  if (variant === 'gradient' && (selected || !onPress)) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.chip, sizeStyles.container]}
        >
          {content}
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
      style={[
        animatedStyle,
        styles.chip,
        sizeStyles.container,
        colorStyles.container,
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </AnimatedPressable>
  );
}

function getSizeStyles(size: ChipSize) {
  switch (size) {
    case 'sm':
      return {
        container: {
          height: 24,
          paddingHorizontal: Spacing.sm,
          borderRadius: BorderRadius.full,
        },
        text: Typography.micro,
        iconSize: 12,
      };
    case 'lg':
      return {
        container: {
          height: 40,
          paddingHorizontal: Spacing.md,
          borderRadius: BorderRadius.full,
        },
        text: Typography.callout,
        iconSize: 18,
      };
    case 'md':
    default:
      return {
        container: {
          height: 32,
          paddingHorizontal: Spacing.smd,
          borderRadius: BorderRadius.full,
        },
        text: Typography.caption,
        iconSize: 14,
      };
  }
}

function getColorStyles(color: ChipColor, variant: ChipVariant, selected: boolean) {
  const colorMap = {
    primary: {
      main: Colors.primary,
      light: Colors.primaryGhost,
      text: Colors.primary,
    },
    success: {
      main: Colors.success,
      light: Colors.successMuted,
      text: Colors.success,
    },
    warning: {
      main: Colors.warning,
      light: Colors.warningMuted,
      text: Colors.warning,
    },
    error: {
      main: Colors.error,
      light: Colors.errorMuted,
      text: Colors.error,
    },
    info: {
      main: Colors.info,
      light: Colors.infoMuted,
      text: Colors.info,
    },
    neutral: {
      main: Colors.neutral500,
      light: Colors.neutral100,
      text: Colors.neutral600,
    },
  };

  const colors = colorMap[color];

  switch (variant) {
    case 'filled':
      return {
        container: {
          backgroundColor: selected ? colors.main : colors.light,
        },
        text: {
          color: selected ? Colors.textOnPrimary : colors.text,
        },
      };
    case 'outlined':
      return {
        container: {
          backgroundColor: selected ? colors.light : 'transparent',
          borderWidth: 1,
          borderColor: colors.main,
        },
        text: {
          color: colors.text,
        },
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: selected ? colors.light : 'transparent',
        },
        text: {
          color: colors.text,
        },
      };
    case 'gradient':
    default:
      return {
        container: {
          backgroundColor: colors.light,
        },
        text: {
          color: selected ? Colors.textOnPrimary : colors.text,
        },
      };
  }
}

// Badge variant for status indicators
interface BadgeProps {
  label: string;
  color?: ChipColor;
  size?: 'sm' | 'md';
  icon?: keyof typeof Ionicons.glyphMap;
  pulse?: boolean;
  style?: ViewStyle;
}

export function Badge({
  label,
  color = 'primary',
  size = 'sm',
  icon,
  pulse = false,
  style,
}: BadgeProps) {
  const colorStyles = getColorStyles(color, 'filled', true);
  const sizeStyles = getSizeStyles(size);

  return (
    <View style={[styles.badge, sizeStyles.container, colorStyles.container, style]}>
      {pulse && (
        <View style={[styles.pulseOuter, { backgroundColor: colorStyles.container.backgroundColor }]}>
          <View style={[styles.pulseInner, { backgroundColor: Colors.textOnPrimary }]} />
        </View>
      )}
      {icon && (
        <Ionicons
          name={icon}
          size={sizeStyles.iconSize}
          color={Colors.textOnPrimary}
          style={styles.badgeIcon}
        />
      )}
      <Text style={[styles.badgeLabel, sizeStyles.text, { color: Colors.textOnPrimary }]}>
        {label}
      </Text>
    </View>
  );
}

// Live indicator badge
export function LiveBadge({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.liveBadge, style]}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
  icon: {
    marginRight: Spacing.xxs,
  },
  removeButton: {
    marginLeft: Spacing.xxs,
  },
  disabled: {
    opacity: 0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    marginRight: Spacing.xxs,
  },
  badgeLabel: {
    fontWeight: '600',
  },
  pulseOuter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  liveText: {
    ...Typography.micro,
    fontWeight: '700',
    color: Colors.error,
    letterSpacing: 0.5,
  },
});
