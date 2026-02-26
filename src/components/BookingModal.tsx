import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';
import { Train } from '../services/types';
import { formatTime, formatDate } from '../services/navitia';
import { showToast } from './Toast';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BookingModalProps {
  visible: boolean;
  train: Train | null;
  onClose: () => void;
  onConfirm?: (train: Train) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  train,
  onClose,
  onConfirm,
}) => {
  const [passengers, setPassengers] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const checkmarkScale = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      setPassengers(1);
      setIsConfirming(false);
      setShowSuccess(false);
      checkmarkScale.value = 0;
      confettiOpacity.value = 0;
    }
  }, [visible, checkmarkScale, confettiOpacity]);

  const handleConfirm = async () => {
    if (!train) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsConfirming(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsConfirming(false);
    setShowSuccess(true);

    // Success animation
    checkmarkScale.value = withSpring(1, { damping: 10, stiffness: 150 });
    confettiOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(1500, withTiming(0, { duration: 300 }))
    );

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Auto-close after animation
    setTimeout(() => {
      onConfirm?.(train);
      onClose();
      showToast('Réservation confirmée 🎉', 'success');
    }, 2000);
  };

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
  }));

  const confettiStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  if (!train) return null;

  const totalPrice = train.price * passengers;
  const originalPrice = train.originalPrice ? train.originalPrice * passengers : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown.duration(200)}
          style={styles.modalContainer}
        >
          {showSuccess ? (
            <View style={styles.successContainer}>
              {/* Confetti effect */}
              <Animated.View style={[styles.confettiContainer, confettiStyle]}>
                {['🎉', '✨', '🚄', '💜', '⭐'].map((emoji, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.confettiEmoji,
                      {
                        left: `${15 + i * 18}%`,
                        top: `${10 + (i % 3) * 20}%`,
                        transform: [{ rotate: `${i * 30}deg` }],
                      },
                    ]}
                  >
                    {emoji}
                  </Text>
                ))}
              </Animated.View>

              <Animated.View style={[styles.checkmarkCircle, checkmarkStyle]}>
                <LinearGradient
                  colors={[Colors.success, '#059669']}
                  style={styles.checkmarkGradient}
                >
                  <Ionicons name="checkmark" size={60} color="white" />
                </LinearGradient>
              </Animated.View>

              <Text style={styles.successTitle}>Réservation confirmée!</Text>
              <Text style={styles.successSubtitle}>
                {train.origin.city} → {train.destination.city}
              </Text>
              <Text style={styles.successPrice}>{totalPrice}€</Text>
            </View>
          ) : (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Text style={styles.modalTitle}>Réserver votre billet</Text>
                  <View style={styles.trainBadge}>
                    <Ionicons name="train" size={14} color={Colors.primary} />
                    <Text style={styles.trainNumber}>{train.trainNumber}</Text>
                  </View>
                </View>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={Colors.textSecondary} />
                </Pressable>
              </View>

              {/* Route Card */}
              <View style={styles.routeCard}>
                <View style={styles.routeRow}>
                  <View style={styles.stationColumn}>
                    <Text style={styles.timeText}>{formatTime(train.departureTime)}</Text>
                    <Text style={styles.cityText}>{train.origin.city}</Text>
                    <Text style={styles.stationText}>{train.origin.name}</Text>
                  </View>

                  <View style={styles.durationColumn}>
                    <View style={styles.durationLine}>
                      <View style={styles.dot} />
                      <View style={styles.line} />
                      <Ionicons name="train-outline" size={16} color={Colors.primary} />
                      <View style={styles.line} />
                      <View style={[styles.dot, styles.dotFilled]} />
                    </View>
                    <Text style={styles.durationText}>{train.duration}</Text>
                  </View>

                  <View style={[styles.stationColumn, styles.stationRight]}>
                    <Text style={styles.timeText}>{formatTime(train.arrivalTime)}</Text>
                    <Text style={styles.cityText}>{train.destination.city}</Text>
                    <Text style={styles.stationText}>{train.destination.name}</Text>
                  </View>
                </View>

                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.dateText}>{formatDate(train.departureTime)}</Text>
                </View>
              </View>

              {/* AI Recommendation */}
              {train.aiRecommendation && (
                <View style={styles.aiCard}>
                  <LinearGradient
                    colors={[Colors.aiGlow, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.aiGradient}
                  />
                  <View style={styles.aiContent}>
                    <View style={styles.aiHeader}>
                      <Ionicons name="sparkles" size={18} color={Colors.primary} />
                      <Text style={styles.aiTitle}>Recommandation IA</Text>
                    </View>
                    <Text style={styles.aiText}>
                      {train.priceRecommendation === 'buy_now'
                        ? '🟢 Bon moment pour acheter ! Le prix est au plus bas.'
                        : '🟡 Prix stable. Vous pouvez attendre sans risque.'}
                    </Text>
                    {train.aiScore && (
                      <View style={styles.aiScoreRow}>
                        <Text style={styles.aiScoreLabel}>Score IA:</Text>
                        <View style={styles.aiScoreBar}>
                          <View style={[styles.aiScoreFill, { width: `${train.aiScore}%` }]} />
                        </View>
                        <Text style={styles.aiScoreValue}>{train.aiScore}/100</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Passengers */}
              <View style={styles.passengersCard}>
                <Text style={styles.sectionTitle}>Passagers</Text>
                <View style={styles.passengerSelector}>
                  <Pressable
                    style={[styles.passengerButton, passengers <= 1 && styles.passengerButtonDisabled]}
                    onPress={() => {
                      if (passengers > 1) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setPassengers(p => p - 1);
                      }
                    }}
                  >
                    <Ionicons
                      name="remove"
                      size={20}
                      color={passengers <= 1 ? Colors.textMuted : Colors.navy}
                    />
                  </Pressable>

                  <View style={styles.passengerCount}>
                    <Text style={styles.passengerNumber}>{passengers}</Text>
                    <Text style={styles.passengerLabel}>
                      {passengers === 1 ? 'adulte' : 'adultes'}
                    </Text>
                  </View>

                  <Pressable
                    style={[styles.passengerButton, passengers >= 9 && styles.passengerButtonDisabled]}
                    onPress={() => {
                      if (passengers < 9) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setPassengers(p => p + 1);
                      }
                    }}
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color={passengers >= 9 ? Colors.textMuted : Colors.navy}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Amenities */}
              <View style={styles.amenitiesRow}>
                {train.amenities.map((amenity, i) => {
                  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
                    wifi: 'wifi',
                    power: 'flash',
                    bar: 'cafe',
                    quiet: 'volume-mute',
                  };
                  return (
                    <View key={i} style={styles.amenityChip}>
                      <Ionicons name={icons[amenity] || 'checkmark'} size={14} color={Colors.navy} />
                      <Text style={styles.amenityText}>
                        {amenity === 'wifi' ? 'WiFi' :
                         amenity === 'power' ? 'Prise' :
                         amenity === 'bar' ? 'Bar' : 'Calme'}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Price Summary */}
              <View style={styles.priceSummary}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Prix unitaire</Text>
                  <Text style={styles.priceValue}>{train.price}€</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Passagers</Text>
                  <Text style={styles.priceValue}>×{passengers}</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <View style={styles.totalPriceContainer}>
                    {originalPrice && (
                      <Text style={styles.originalPrice}>{originalPrice}€</Text>
                    )}
                    <Text style={styles.totalPrice}>{totalPrice}€</Text>
                  </View>
                </View>
                {originalPrice && (
                  <View style={styles.savingsRow}>
                    <Ionicons name="pricetag" size={14} color={Colors.success} />
                    <Text style={styles.savingsText}>
                      Économie de {originalPrice - totalPrice}€ grâce à l'IA
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Button */}
              <AnimatedPressable
                style={styles.confirmButton}
                onPress={handleConfirm}
                disabled={isConfirming}
              >
                <LinearGradient
                  colors={[Colors.success, '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmGradient}
                >
                  {isConfirming ? (
                    <Text style={styles.confirmText}>Confirmation...</Text>
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={22} color="white" />
                      <Text style={styles.confirmText}>Confirmer la réservation</Text>
                    </>
                  )}
                </LinearGradient>
              </AnimatedPressable>

              <Text style={styles.disclaimer}>
                En confirmant, vous acceptez les conditions générales de vente.
              </Text>
            </ScrollView>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    maxHeight: SCREEN_HEIGHT * 0.9,
    minHeight: SCREEN_HEIGHT * 0.5,
    ...Shadows.large,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
  trainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  trainNumber: {
    ...Typography.smallBold,
    color: Colors.primary,
    marginLeft: 4,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  routeCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationColumn: {
    flex: 1,
  },
  stationRight: {
    alignItems: 'flex-end',
  },
  timeText: {
    ...Typography.h3,
    color: Colors.navy,
  },
  cityText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  stationText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  durationColumn: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  durationLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: Colors.primary,
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: Colors.primaryLight,
  },
  durationText: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  dateText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  aiCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  aiGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  aiContent: {
    padding: Spacing.md,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  aiTitle: {
    ...Typography.captionBold,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  aiText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  aiScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  aiScoreLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  aiScoreBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 3,
    marginHorizontal: Spacing.sm,
    overflow: 'hidden',
  },
  aiScoreFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  aiScoreValue: {
    ...Typography.smallBold,
    color: Colors.success,
  },
  passengersCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  passengerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
  },
  passengerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  passengerButtonDisabled: {
    backgroundColor: Colors.backgroundTertiary,
    ...Shadows.small,
    shadowOpacity: 0,
  },
  passengerCount: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  passengerNumber: {
    ...Typography.h2,
    color: Colors.navy,
  },
  passengerLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  amenityText: {
    ...Typography.small,
    color: Colors.navy,
    marginLeft: 4,
  },
  priceSummary: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  priceLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  priceValue: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
  priceDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    ...Typography.bodyBold,
    color: Colors.navy,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    ...Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    marginRight: Spacing.sm,
  },
  totalPrice: {
    ...Typography.h2,
    color: Colors.success,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  savingsText: {
    ...Typography.small,
    color: Colors.success,
    marginLeft: Spacing.xs,
  },
  confirmButton: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  confirmText: {
    ...Typography.bodyBold,
    color: 'white',
    marginLeft: Spacing.sm,
  },
  disclaimer: {
    ...Typography.small,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  // Success state
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    minHeight: 350,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confettiEmoji: {
    position: 'absolute',
    fontSize: 32,
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.glow,
  },
  checkmarkGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    ...Typography.h2,
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
  successSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  successPrice: {
    ...Typography.h1,
    color: Colors.success,
  },
});
