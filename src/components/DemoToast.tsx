import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

export interface DemoToastProps {
  visible: boolean;
  message: string;
  subMessage?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
  variant?: 'default' | 'alert' | 'success' | 'ai';
}

const variantConfig = {
  default: {
    gradientColors: [Colors.primary, Colors.primaryDark] as [string, string],
    iconColor: '#FFF',
    textColor: '#FFF',
  },
  alert: {
    gradientColors: [Colors.warning, '#D97706'] as [string, string],
    iconColor: '#FFF',
    textColor: '#FFF',
  },
  success: {
    gradientColors: [Colors.success, '#059669'] as [string, string],
    iconColor: '#FFF',
    textColor: '#FFF',
  },
  ai: {
    gradientColors: ['#8B5CF6', '#6D28D9'] as [string, string],
    iconColor: '#FFF',
    textColor: '#FFF',
  },
};

export const DemoToast: React.FC<DemoToastProps> = ({
  visible,
  message,
  subMessage,
  icon = '🎬',
  actionLabel,
  onAction,
  onDismiss,
  duration = 4000,
  variant = 'default',
}) => {
  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  const config = variantConfig[variant];

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 12, stiffness: 150 });

      if (duration > 0 && !actionLabel) {
        const timeout = setTimeout(() => {
          hideToast();
        }, duration);
        return () => clearTimeout(timeout);
      }
    }
  }, [visible, duration, actionLabel]);

  const hideToast = () => {
    translateY.value = withTiming(-150, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onDismiss)();
    });
    scale.value = withTiming(0.9, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={config.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.icon}>{icon}</Text>
          <View style={styles.textContainer}>
            <Text style={[styles.message, { color: config.textColor }]}>
              {message}
            </Text>
            {subMessage && (
              <Text style={[styles.subMessage, { color: config.textColor }]}>
                {subMessage}
              </Text>
            )}
          </View>
          {actionLabel ? (
            <Pressable
              style={styles.actionButton}
              onPress={() => {
                onAction?.();
                hideToast();
              }}
            >
              <Text style={styles.actionText}>{actionLabel}</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.closeButton} onPress={hideToast}>
              <Ionicons name="close" size={20} color={config.iconColor} />
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Demo Notification Banner (push notification style)
export interface DemoNotificationProps {
  visible: boolean;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
}

export const DemoNotification: React.FC<DemoNotificationProps> = ({
  visible,
  title,
  body,
  actionLabel = 'Réserver',
  onAction,
  onDismiss,
}) => {
  const translateY = useSharedValue(-200);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [visible]);

  const hideNotification = () => {
    translateY.value = withTiming(-200, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(onDismiss)();
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.notificationContainer, animatedStyle]}>
      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationAppIcon}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.appIconGradient}
            >
              <Ionicons name="train" size={14} color="#FFF" />
            </LinearGradient>
          </View>
          <Text style={styles.notificationAppName}>Velvet</Text>
          <Text style={styles.notificationTime}>maintenant</Text>
        </View>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationBody}>{body}</Text>
        <View style={styles.notificationActions}>
          <Pressable
            style={styles.notificationActionPrimary}
            onPress={() => {
              onAction?.();
              hideNotification();
            }}
          >
            <Text style={styles.notificationActionPrimaryText}>{actionLabel}</Text>
          </Pressable>
          <Pressable style={styles.notificationActionSecondary} onPress={hideNotification}>
            <Text style={styles.notificationActionSecondaryText}>Plus tard</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 10000,
  },
  gradient: {
    borderRadius: BorderRadius.lg,
    ...Shadows.large,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  message: {
    ...Typography.bodyBold,
    color: '#FFF',
  },
  subMessage: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  actionText: {
    ...Typography.captionBold,
    color: '#FFF',
  },
  closeButton: {
    padding: Spacing.xs,
    opacity: 0.8,
  },

  // Notification styles
  notificationContainer: {
    position: 'absolute',
    top: 50,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 10001,
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.large,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  notificationAppIcon: {
    marginRight: 4,
  },
  appIconGradient: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationAppName: {
    ...Typography.smallBold,
    color: Colors.textSecondary,
    flex: 1,
  },
  notificationTime: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  notificationTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  notificationBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  notificationActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  notificationActionPrimary: {
    flex: 1,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  notificationActionPrimaryText: {
    ...Typography.captionBold,
    color: '#FFF',
  },
  notificationActionSecondary: {
    flex: 1,
    backgroundColor: Colors.backgroundTertiary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  notificationActionSecondaryText: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
});
