import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

const toastConfig: Record<ToastType, { icon: keyof typeof Ionicons.glyphMap; color: string; bgColor: string }> = {
  success: { icon: 'checkmark-circle', color: Colors.success, bgColor: Colors.successLight },
  error: { icon: 'close-circle', color: Colors.error, bgColor: Colors.errorLight },
  warning: { icon: 'warning', color: Colors.warning, bgColor: Colors.warningLight },
  info: { icon: 'information-circle', color: Colors.info, bgColor: Colors.infoLight },
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onDismiss,
}) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const config = toastConfig[type];

  const hideToast = useCallback(() => {
    translateY.value = withTiming(-100, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onDismiss)();
    });
  }, [onDismiss, opacity, translateY]);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(
        type === 'success' ? Haptics.NotificationFeedbackType.Success :
        type === 'error' ? Haptics.NotificationFeedbackType.Error :
        Haptics.NotificationFeedbackType.Warning
      );
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto-dismiss
      translateY.value = withDelay(duration, withTiming(-100, { duration: 200 }));
      opacity.value = withDelay(duration, withTiming(0, { duration: 200 }, () => {
        runOnJS(onDismiss)();
      }));
    }
  }, [visible, duration, onDismiss, type, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        style={[styles.toast, { backgroundColor: config.bgColor }]}
        onPress={hideToast}
      >
        <Ionicons name={config.icon} size={24} color={config.color} />
        <Text style={[styles.message, { color: config.color }]}>{message}</Text>
        <Ionicons name="close" size={20} color={config.color} style={styles.closeIcon} />
      </Pressable>
    </Animated.View>
  );
};

// Toast Manager for global use
interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

let toastCallback: ((state: ToastState) => void) | null = null;

export const setToastCallback = (callback: (state: ToastState) => void) => {
  toastCallback = callback;
};

export const showToast = (message: string, type: ToastType = 'success') => {
  if (toastCallback) {
    toastCallback({ visible: true, message, type });
  }
};

export const hideToast = () => {
  if (toastCallback) {
    toastCallback({ visible: false, message: '', type: 'success' });
  }
};

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastState, setToastState] = React.useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    setToastCallback(setToastState);
    return () => {
      toastCallback = null;
    };
  }, []);

  return (
    <>
      {children}
      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        onDismiss={() => setToastState(prev => ({ ...prev, visible: false }))}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  message: {
    ...Typography.bodyBold,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  closeIcon: {
    marginLeft: Spacing.sm,
    opacity: 0.6,
  },
});
