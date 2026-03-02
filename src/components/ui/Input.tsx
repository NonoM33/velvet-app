/**
 * Input Component
 * Premium text input with multiple variants
 */
import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  Platform,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Spacing, Motion, TouchTargets, Shadows } from '../../constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  disabled?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      variant = 'default',
      size = 'md',
      containerStyle,
      inputStyle,
      disabled = false,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const focusAnimation = useSharedValue(0);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      focusAnimation.value = withTiming(1, { duration: Motion.duration.fast });
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      focusAnimation.value = withTiming(0, { duration: Motion.duration.fast });
      onBlur?.(e);
    };

    const animatedContainerStyle = useAnimatedStyle(() => {
      const borderColor = error
        ? Colors.error
        : interpolateColor(
            focusAnimation.value,
            [0, 1],
            [Colors.border, Colors.primary]
          );

      return {
        borderColor,
      };
    });

    const sizeStyles = getSizeStyles(size);
    const variantStyles = getVariantStyles(variant, isFocused, !!error, disabled);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            style={[
              styles.label,
              error && styles.labelError,
              disabled && styles.labelDisabled,
            ]}
          >
            {label}
          </Text>
        )}

        <Animated.View
          style={[
            styles.inputContainer,
            sizeStyles.container,
            variantStyles.container,
            animatedContainerStyle,
            disabled && styles.inputDisabled,
          ]}
        >
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={sizeStyles.iconSize}
              color={error ? Colors.error : isFocused ? Colors.primary : Colors.textTertiary}
              style={styles.leftIcon}
            />
          )}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              sizeStyles.input,
              variantStyles.input,
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              inputStyle,
            ]}
            placeholderTextColor={Colors.textMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            selectionColor={Colors.primary}
            {...props}
          />

          {rightIcon && (
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onRightIconPress?.();
              }}
              style={styles.rightIconButton}
              disabled={!onRightIconPress}
            >
              <Ionicons
                name={rightIcon}
                size={sizeStyles.iconSize}
                color={error ? Colors.error : Colors.textTertiary}
              />
            </Pressable>
          )}
        </Animated.View>

        {(error || hint) && (
          <Text style={[styles.hint, error && styles.hintError]}>
            {error || hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

function getSizeStyles(size: 'sm' | 'md' | 'lg') {
  switch (size) {
    case 'sm':
      return {
        container: {
          height: 36,
          paddingHorizontal: Spacing.sm,
          borderRadius: BorderRadius.sm,
        },
        input: {
          ...Typography.caption,
        },
        iconSize: 16,
      };
    case 'lg':
      return {
        container: {
          height: TouchTargets.large,
          paddingHorizontal: Spacing.md,
          borderRadius: BorderRadius.md,
        },
        input: {
          ...Typography.body,
        },
        iconSize: 22,
      };
    case 'md':
    default:
      return {
        container: {
          height: TouchTargets.minimum,
          paddingHorizontal: Spacing.smd,
          borderRadius: BorderRadius.md,
        },
        input: {
          ...Typography.callout,
        },
        iconSize: 20,
      };
  }
}

function getVariantStyles(
  variant: 'default' | 'filled' | 'outlined',
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean
) {
  switch (variant) {
    case 'filled':
      return {
        container: {
          backgroundColor: isFocused ? Colors.surface : Colors.backgroundTertiary,
          borderWidth: 1,
          borderColor: hasError ? Colors.error : 'transparent',
        },
        input: {
          color: disabled ? Colors.textMuted : Colors.textPrimary,
        },
      };
    case 'outlined':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: hasError ? Colors.error : Colors.border,
        },
        input: {
          color: disabled ? Colors.textMuted : Colors.textPrimary,
        },
      };
    case 'default':
    default:
      return {
        container: {
          backgroundColor: Colors.backgroundSecondary,
          borderWidth: 1,
          borderColor: hasError ? Colors.error : Colors.border,
        },
        input: {
          color: disabled ? Colors.textMuted : Colors.textPrimary,
        },
      };
  }
}

// Search Input variant
interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'variant'> {
  onClear?: () => void;
}

export function SearchInput({ value, onClear, ...props }: SearchInputProps) {
  return (
    <Input
      {...props}
      value={value}
      leftIcon="search"
      rightIcon={value ? 'close-circle' : undefined}
      onRightIconPress={onClear}
      variant="filled"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    marginLeft: Spacing.xxs,
  },
  labelError: {
    color: Colors.error,
  },
  labelDisabled: {
    color: Colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
  },
  inputWithLeftIcon: {
    marginLeft: Spacing.sm,
  },
  inputWithRightIcon: {
    marginRight: Spacing.sm,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIconButton: {
    padding: Spacing.xxs,
    marginLeft: Spacing.xs,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginLeft: Spacing.xxs,
  },
  hintError: {
    color: Colors.error,
  },
});
