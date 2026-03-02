/**
 * Card Component
 * Premium card with multiple variants and elevation levels
 */
import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Spacing, Shadows, Motion } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled' | 'ai' | 'glass';
type CardElevation = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  elevation?: CardElevation;
  onPress?: () => void;
  disabled?: boolean;
  animated?: boolean;
  animationDelay?: number;
  animationDirection?: 'up' | 'down' | 'none';
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  haptic?: boolean;
}

export function Card({
  children,
  variant = 'default',
  elevation = 'sm',
  onPress,
  disabled = false,
  animated = false,
  animationDelay = 0,
  animationDirection = 'down',
  style,
  contentStyle,
  haptic = true,
}: CardProps) {
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
    if (disabled) return;
    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const variantStyles = getVariantStyles(variant);
  const elevationStyles = getElevationStyles(elevation);

  const getEnteringAnimation = () => {
    if (!animated) return undefined;

    switch (animationDirection) {
      case 'up':
        return FadeInUp.delay(animationDelay).duration(400).springify();
      case 'down':
        return FadeInDown.delay(animationDelay).duration(400).springify();
      case 'none':
      default:
        return FadeIn.delay(animationDelay).duration(300);
    }
  };

  const content = (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  // AI variant with gradient border
  if (variant === 'ai') {
    const cardContent = (
      <LinearGradient
        colors={[Colors.aiGlow, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.aiGradientBorder}
      >
        <View style={[styles.aiInner, contentStyle]}>{children}</View>
      </LinearGradient>
    );

    if (onPress) {
      return (
        <AnimatedPressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          entering={getEnteringAnimation()}
          style={[
            animatedStyle,
            styles.card,
            variantStyles,
            elevationStyles,
            disabled && styles.disabled,
            style,
          ]}
        >
          {cardContent}
        </AnimatedPressable>
      );
    }

    return (
      <Animated.View
        entering={getEnteringAnimation()}
        style={[
          styles.card,
          variantStyles,
          elevationStyles,
          style,
        ]}
      >
        {cardContent}
      </Animated.View>
    );
  }

  // Regular cards
  if (onPress) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        entering={getEnteringAnimation()}
        style={[
          animatedStyle,
          styles.card,
          variantStyles,
          elevationStyles,
          disabled && styles.disabled,
          style,
        ]}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View
      entering={getEnteringAnimation()}
      style={[
        styles.card,
        variantStyles,
        elevationStyles,
        style,
      ]}
    >
      {content}
    </Animated.View>
  );
}

function getVariantStyles(variant: CardVariant): ViewStyle {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: Colors.surfaceElevated,
        borderWidth: 0,
      };
    case 'outlined':
      return {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
      };
    case 'filled':
      return {
        backgroundColor: Colors.surfaceMuted,
        borderWidth: 0,
      };
    case 'ai':
      return {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.primaryGhost,
        overflow: 'hidden',
      };
    case 'glass':
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
      };
    case 'default':
    default:
      return {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      };
  }
}

function getElevationStyles(elevation: CardElevation): ViewStyle {
  switch (elevation) {
    case 'none':
      return Shadows.none;
    case 'md':
      return Shadows.md;
    case 'lg':
      return Shadows.lg;
    case 'sm':
    default:
      return Shadows.sm;
  }
}

// Compact card for list items
interface ListCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  style?: ViewStyle;
}

export function ListCard({
  children,
  onPress,
  leftContent,
  rightContent,
  style,
}: ListCardProps) {
  return (
    <Card
      variant="default"
      elevation="none"
      onPress={onPress}
      style={[styles.listCard, style]}
      contentStyle={styles.listCardContent}
    >
      {leftContent && <View style={styles.listCardLeft}>{leftContent}</View>}
      <View style={styles.listCardCenter}>{children}</View>
      {rightContent && <View style={styles.listCardRight}>{rightContent}</View>}
    </Card>
  );
}

// Section card with header
interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export function SectionCard({
  title,
  subtitle,
  children,
  action,
  style,
}: SectionCardProps) {
  return (
    <Card variant="default" elevation="sm" style={style}>
      {(title || action) && (
        <View style={styles.sectionHeader}>
          <View>
            {title && (
              <Animated.Text style={styles.sectionTitle}>{title}</Animated.Text>
            )}
            {subtitle && (
              <Animated.Text style={styles.sectionSubtitle}>{subtitle}</Animated.Text>
            )}
          </View>
          {action}
        </View>
      )}
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.md,
  },
  disabled: {
    opacity: 0.6,
  },
  aiGradientBorder: {
    padding: 1,
    borderRadius: BorderRadius.lg - 1,
  },
  aiInner: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg - 2,
    padding: Spacing.md,
  },
  listCard: {
    borderRadius: BorderRadius.md,
  },
  listCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.smd,
  },
  listCardLeft: {
    marginRight: Spacing.smd,
  },
  listCardCenter: {
    flex: 1,
  },
  listCardRight: {
    marginLeft: Spacing.smd,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.smd,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
