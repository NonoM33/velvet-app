/**
 * Button Component
 * Premium buttons with multiple variants and states
 */
import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing, Motion, TouchTargets, Shadows } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  haptic = true,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, Motion.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Motion.spring.snappy);
  };

  const handlePress = () => {
    if (disabled || loading) return;
    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const sizeStyles = getSizeStyles(size);
  const variantStyles = getVariantStyles(variant, disabled);
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text.color as string}
          style={styles.loader}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={variantStyles.text.color as string}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              sizeStyles.text,
              variantStyles.text,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={variantStyles.text.color as string}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </>
  );

  const buttonContent = (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        animatedStyle,
        styles.base,
        sizeStyles.container,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {variant === 'primary' || variant === 'success' ? (
        <LinearGradient
          colors={variantStyles.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeStyles.container]}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </AnimatedPressable>
  );

  return buttonContent;
}

function getSizeStyles(size: ButtonSize) {
  switch (size) {
    case 'sm':
      return {
        container: {
          height: 36,
          paddingHorizontal: Spacing.smd,
          borderRadius: BorderRadius.sm,
        },
        text: {
          ...Typography.captionMedium,
        },
      };
    case 'lg':
      return {
        container: {
          height: TouchTargets.large,
          paddingHorizontal: Spacing.lg,
          borderRadius: BorderRadius.md,
        },
        text: {
          ...Typography.bodySemibold,
        },
      };
    case 'md':
    default:
      return {
        container: {
          height: TouchTargets.minimum,
          paddingHorizontal: Spacing.md,
          borderRadius: BorderRadius.md,
        },
        text: {
          ...Typography.calloutMedium,
        },
      };
  }
}

function getVariantStyles(variant: ButtonVariant, disabled: boolean) {
  const disabledOpacity = disabled ? 0.5 : 1;

  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: 'transparent',
          overflow: 'hidden' as const,
          opacity: disabledOpacity,
        },
        text: {
          color: Colors.textOnPrimary,
        },
        gradient: [Colors.primary, Colors.primaryDark],
      };
    case 'success':
      return {
        container: {
          backgroundColor: 'transparent',
          overflow: 'hidden' as const,
          opacity: disabledOpacity,
        },
        text: {
          color: Colors.textOnPrimary,
        },
        gradient: [Colors.success, '#047857'],
      };
    case 'danger':
      return {
        container: {
          backgroundColor: Colors.error,
          opacity: disabledOpacity,
        },
        text: {
          color: Colors.textOnPrimary,
        },
        gradient: undefined,
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: Colors.primaryGhost,
          opacity: disabledOpacity,
        },
        text: {
          color: Colors.primary,
        },
        gradient: undefined,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: Colors.primary,
          opacity: disabledOpacity,
        },
        text: {
          color: Colors.primary,
        },
        gradient: undefined,
      };
    case 'ghost':
    default:
      return {
        container: {
          backgroundColor: 'transparent',
          opacity: disabledOpacity,
        },
        text: {
          color: Colors.primary,
        },
        gradient: undefined,
      };
  }
}

// Icon-only button variant
interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  haptic?: boolean;
}

export function IconButton({
  icon,
  onPress,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  style,
  haptic = true,
}: IconButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, Motion.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, Motion.spring.snappy);
  };

  const handlePress = () => {
    if (disabled) return;
    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const sizeConfig = {
    sm: { size: 32, iconSize: 18 },
    md: { size: 40, iconSize: 22 },
    lg: { size: 48, iconSize: 26 },
  };

  const config = sizeConfig[size];
  const variantStyles = getVariantStyles(variant, disabled);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        styles.iconButton,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
        },
        variantStyles.container,
        style,
      ]}
    >
      <Ionicons
        name={icon}
        size={config.iconSize}
        color={variantStyles.text.color as string}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  loader: {
    marginRight: 0,
  },
  iconLeft: {
    marginRight: Spacing.xs,
  },
  iconRight: {
    marginLeft: Spacing.xs,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
