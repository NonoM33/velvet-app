import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInRight,
  FadeInDown,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/store';
import { DemoToast, DemoNotification } from './DemoToast';
import { GlassCard } from './GlassCard';
import {
  demoScenarios,
  demoPrixPredictif,
  demoPerturbation,
  demoReservationEclair,
  demoAlertePrix,
  demoDernierKilometre,
  demoToasts,
} from '../services/demoData';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';
import { showToast } from './Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DemoOverlay: React.FC = () => {
  const { demoMode, demoScenarioIndex, setDemoScenario, nextDemoScenario, deactivateDemo } = useStore();

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSubMessage, setToastSubMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('🎬');
  const [toastVariant, setToastVariant] = useState<'default' | 'alert' | 'success' | 'ai'>('default');
  const [toastAction, setToastAction] = useState<{ label: string; onPress: () => void } | null>(null);

  // Notification state
  const [notificationVisible, setNotificationVisible] = useState(false);

  // Scenario-specific states
  const [showPriceAnimation, setShowPriceAnimation] = useState(false);
  const [showDisruption, setShowDisruption] = useState(false);
  const [showDisruptionSolution, setShowDisruptionSolution] = useState(false);
  const [showSearchAnimation, setShowSearchAnimation] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [showLastMile, setShowLastMile] = useState(false);

  // Animation values for price prediction
  const priceValue = useSharedValue(demoPrixPredictif.initialPrice);
  const confidenceValue = useSharedValue(0);
  const buttonGlow = useSharedValue(1);

  const scenarioTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllStates = useCallback(() => {
    setToastVisible(false);
    setNotificationVisible(false);
    setShowPriceAnimation(false);
    setShowDisruption(false);
    setShowDisruptionSolution(false);
    setShowSearchAnimation(false);
    setShowSearchResults(false);
    setShowBookingSuccess(false);
    setShowLastMile(false);
    priceValue.value = demoPrixPredictif.initialPrice;
    confidenceValue.value = 0;
  }, []);

  const showDemoToast = useCallback((
    message: string,
    subMessage?: string,
    icon?: string,
    variant?: 'default' | 'alert' | 'success' | 'ai',
    action?: { label: string; onPress: () => void }
  ) => {
    setToastMessage(message);
    setToastSubMessage(subMessage || '');
    setToastIcon(icon || '🎬');
    setToastVariant(variant || 'default');
    setToastAction(action || null);
    setToastVisible(true);
  }, []);

  // Run scenario based on index
  const runScenario = useCallback((index: number) => {
    clearAllStates();

    if (index >= demoScenarios.length) {
      // Demo finished
      showToast(demoToasts.demoEnded, 'success');
      deactivateDemo();
      return;
    }

    const scenario = demoScenarios[index];
    setDemoScenario(scenario.id);

    // Show scenario announcement
    showDemoToast(
      scenario.name,
      `Scénario ${index + 1}/${demoScenarios.length}`,
      '🎬',
      'ai'
    );

    // Schedule scenario execution after toast
    setTimeout(() => {
      setToastVisible(false);
      executeScenario(scenario.id);
    }, 1500);
  }, [clearAllStates, showDemoToast, setDemoScenario, deactivateDemo]);

  const executeScenario = useCallback((scenarioId: string) => {
    switch (scenarioId) {
      case 'prix_predictif':
        runPrixPredictif();
        break;
      case 'perturbation':
        runPerturbation();
        break;
      case 'reservation_eclair':
        runReservationEclair();
        break;
      case 'alerte_prix':
        runAlertePrix();
        break;
      case 'dernier_kilometre':
        runDernierKilometre();
        break;
    }

    // Auto-advance to next scenario
    scenarioTimerRef.current = setTimeout(() => {
      nextDemoScenario();
    }, demoScenarios.find(s => s.id === scenarioId)?.duration || 5000);
  }, [nextDemoScenario]);

  // Scenario 1: Prix Prédictif
  const runPrixPredictif = useCallback(() => {
    setShowPriceAnimation(true);

    // Animate price drop
    priceValue.value = withTiming(demoPrixPredictif.finalPrice, {
      duration: demoPrixPredictif.animationDuration,
      easing: Easing.out(Easing.cubic),
    });

    // Animate confidence meter
    setTimeout(() => {
      confidenceValue.value = withTiming(demoPrixPredictif.confidenceEnd, {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      });
    }, 500);

    // Show AI toast
    setTimeout(() => {
      showDemoToast(demoPrixPredictif.toastMessage, undefined, '🤖', 'ai');
    }, 1000);

    // Pulse button glow
    setTimeout(() => {
      buttonGlow.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    }, 2500);
  }, [priceValue, confidenceValue, buttonGlow, showDemoToast]);

  // Scenario 2: Perturbation Détectée
  const runPerturbation = useCallback(() => {
    // Show disruption card sliding in
    setShowDisruption(true);

    // After 2 seconds, show AI solution
    setTimeout(() => {
      setShowDisruptionSolution(true);
    }, 2000);

    // Show action toast
    setTimeout(() => {
      showDemoToast(
        demoPerturbation.solution.message,
        undefined,
        '🤖',
        'alert',
        {
          label: 'Changer de train',
          onPress: () => {
            showToast(demoPerturbation.toastOnSwap, 'success');
          }
        }
      );
    }, 2500);
  }, [showDemoToast]);

  // Scenario 3: Réservation Éclair
  const runReservationEclair = useCallback(() => {
    setShowSearchAnimation(true);

    // Show search results after "typing"
    setTimeout(() => {
      setShowSearchResults(true);
    }, 1000);

    // Auto-select and book
    setTimeout(() => {
      setShowBookingSuccess(true);
      showDemoToast(demoReservationEclair.successMessage, undefined, '✨', 'success');
    }, 3000);
  }, [showDemoToast]);

  // Scenario 4: Alerte Prix Intelligente
  const runAlertePrix = useCallback(() => {
    setNotificationVisible(true);
  }, []);

  // Scenario 5: Dernier Kilomètre
  const runDernierKilometre = useCallback(() => {
    setShowLastMile(true);
  }, []);

  // Handle demo mode changes
  useEffect(() => {
    if (demoMode) {
      runScenario(demoScenarioIndex);
    } else {
      clearAllStates();
      if (scenarioTimerRef.current) {
        clearTimeout(scenarioTimerRef.current);
      }
    }

    return () => {
      if (scenarioTimerRef.current) {
        clearTimeout(scenarioTimerRef.current);
      }
    };
  }, [demoMode, demoScenarioIndex, runScenario, clearAllStates]);

  // Animated price style
  const priceAnimatedStyle = useAnimatedStyle(() => ({
    fontSize: 48,
    fontWeight: '700',
    color: Colors.success,
  }));

  if (!demoMode) return null;

  return (
    <>
      {/* Demo Toast */}
      <DemoToast
        visible={toastVisible}
        message={toastMessage}
        subMessage={toastSubMessage}
        icon={toastIcon}
        variant={toastVariant}
        actionLabel={toastAction?.label}
        onAction={toastAction?.onPress}
        onDismiss={() => setToastVisible(false)}
        duration={toastAction ? 0 : 3000}
      />

      {/* Demo Notification (Scenario 4) */}
      <DemoNotification
        visible={notificationVisible}
        title={demoAlertePrix.notification.title}
        body={demoAlertePrix.notification.body}
        actionLabel="Réserver"
        onAction={() => {
          showToast(demoAlertePrix.toastOnBook, 'success');
        }}
        onDismiss={() => setNotificationVisible(false)}
      />

      {/* Scenario 1: Prix Prédictif Overlay */}
      {showPriceAnimation && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.scenarioOverlay}
          pointerEvents="none"
        >
          <View style={styles.priceAnimationContainer}>
            <GlassCard variant="ai" style={styles.priceCard}>
              <View style={styles.priceCardContent}>
                <Text style={styles.priceLabel}>Prix actuel</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.oldPrice}>{demoPrixPredictif.initialPrice}€</Text>
                  <Animated.Text style={[styles.currentPrice, priceAnimatedStyle]}>
                    {Math.round(priceValue.value)}€
                  </Animated.Text>
                </View>
                <View style={styles.confidenceRow}>
                  <Ionicons name="analytics" size={16} color={Colors.primary} />
                  <Text style={styles.confidenceText}>
                    IA {Math.round(confidenceValue.value)}% sûre
                  </Text>
                </View>
                <Animated.View style={[styles.buyButton, { transform: [{ scale: buttonGlow.value }] }]}>
                  <LinearGradient
                    colors={[Colors.success, '#059669']}
                    style={styles.buyButtonGradient}
                  >
                    <Text style={styles.buyButtonText}>Acheter maintenant</Text>
                  </LinearGradient>
                </Animated.View>
              </View>
            </GlassCard>
          </View>
        </Animated.View>
      )}

      {/* Scenario 2: Perturbation Overlay */}
      {showDisruption && (
        <Animated.View
          entering={SlideInDown.springify()}
          style={styles.scenarioOverlay}
          pointerEvents="none"
        >
          <View style={styles.disruptionContainer}>
            <GlassCard variant="default" style={styles.disruptionCard}>
              <View style={styles.disruptionContent}>
                <View style={styles.disruptionHeader}>
                  <View style={styles.warningIcon}>
                    <Ionicons name="warning" size={24} color={Colors.warning} />
                  </View>
                  <Text style={styles.disruptionTitle}>
                    {demoPerturbation.disruption.message}
                  </Text>
                </View>
                {showDisruptionSolution && (
                  <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    style={styles.solutionBox}
                  >
                    <Text style={styles.solutionText}>
                      {demoPerturbation.solution.message}
                    </Text>
                    <Pressable style={styles.changeTrainButton}>
                      <Text style={styles.changeTrainText}>Changer de train</Text>
                    </Pressable>
                  </Animated.View>
                )}
              </View>
            </GlassCard>
          </View>
        </Animated.View>
      )}

      {/* Scenario 3: Réservation Éclair Overlay */}
      {showSearchAnimation && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.scenarioOverlay}
          pointerEvents="none"
        >
          <View style={styles.searchContainer}>
            <GlassCard variant="elevated" style={styles.searchCard}>
              <View style={styles.searchInputDemo}>
                <Ionicons name="search" size={18} color={Colors.primary} />
                <Text style={styles.searchText}>{demoReservationEclair.searchQuery}</Text>
              </View>
            </GlassCard>

            {showSearchResults && (
              <Animated.View entering={FadeInDown.delay(100).springify()}>
                {demoReservationEclair.results.map((train, index) => (
                  <Animated.View
                    key={train.id}
                    entering={SlideInRight.delay(index * 150).springify()}
                    style={[
                      styles.trainResultCard,
                      train.aiRecommended && styles.trainResultHighlighted,
                    ]}
                  >
                    <View style={styles.trainResultContent}>
                      {train.aiRecommended && (
                        <View style={styles.aiRecommendBadge}>
                          <Text style={styles.aiRecommendText}>✨ IA recommande</Text>
                        </View>
                      )}
                      <View style={styles.trainResultRow}>
                        <View>
                          <Text style={styles.trainTime}>{train.departure.time}</Text>
                          <Text style={styles.trainNumber}>{train.trainNumber}</Text>
                        </View>
                        <View style={styles.trainPriceBox}>
                          {train.originalPrice && (
                            <Text style={styles.trainOriginalPrice}>{train.originalPrice}€</Text>
                          )}
                          <Text style={styles.trainPrice}>{train.price}€</Text>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </Animated.View>
            )}

            {showBookingSuccess && (
              <Animated.View
                entering={FadeIn.duration(200)}
                style={styles.bookingSuccessOverlay}
              >
                <View style={styles.bookingSuccessContent}>
                  <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
                  <Text style={styles.bookingSuccessText}>
                    {demoReservationEclair.successMessage}
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      )}

      {/* Scenario 5: Dernier Kilomètre Overlay */}
      {showLastMile && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.scenarioOverlay}
          pointerEvents="none"
        >
          <View style={styles.lastMileContainer}>
            <GlassCard variant="elevated" style={styles.lastMileCard}>
              <View style={styles.lastMileHeader}>
                <Ionicons name="location" size={20} color={Colors.primary} />
                <Text style={styles.lastMileTitle}>
                  Tu arrives à {demoDernierKilometre.arrival.station} dans {demoDernierKilometre.arrival.timeUntilArrival}
                </Text>
              </View>
              <View style={styles.lastMileOptions}>
                {demoDernierKilometre.options.map((option, index) => (
                  <Animated.View
                    key={option.id}
                    entering={SlideInRight.delay(index * 100).springify()}
                  >
                    <Pressable style={styles.lastMileOption}>
                      <Text style={styles.lastMileIcon}>{option.icon}</Text>
                      <Text style={styles.lastMileLabel}>{option.label}</Text>
                      <Text style={styles.lastMileDetail}>{option.detail}</Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </GlassCard>
          </View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scenarioOverlay: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },

  // Price Animation (Scenario 1)
  priceAnimationContainer: {
    width: '100%',
  },
  priceCard: {
    width: '100%',
  },
  priceCardContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  priceLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  oldPrice: {
    ...Typography.h2,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.success,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  confidenceText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  buyButton: {
    width: '100%',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.glow,
  },
  buyButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buyButtonText: {
    ...Typography.bodyBold,
    color: '#FFF',
  },

  // Disruption (Scenario 2)
  disruptionContainer: {
    width: '100%',
  },
  disruptionCard: {
    width: '100%',
  },
  disruptionContent: {
    gap: Spacing.md,
  },
  disruptionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  warningIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disruptionTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '600',
  },
  solutionBox: {
    backgroundColor: Colors.aiGlow,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  solutionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  changeTrainButton: {
    backgroundColor: Colors.success,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  changeTrainText: {
    ...Typography.captionBold,
    color: '#FFF',
  },

  // Search (Scenario 3)
  searchContainer: {
    width: '100%',
    gap: Spacing.sm,
  },
  searchCard: {
    width: '100%',
  },
  searchInputDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  searchText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  trainResultCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    ...Shadows.small,
    overflow: 'hidden',
  },
  trainResultHighlighted: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  trainResultContent: {
    padding: Spacing.md,
  },
  aiRecommendBadge: {
    backgroundColor: Colors.aiGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  aiRecommendText: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  trainResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainTime: {
    ...Typography.bodyBold,
    color: Colors.navy,
  },
  trainNumber: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  trainPriceBox: {
    alignItems: 'flex-end',
  },
  trainOriginalPrice: {
    ...Typography.small,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  trainPrice: {
    ...Typography.h3,
    color: Colors.success,
    fontWeight: '700',
  },
  bookingSuccessOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    marginTop: -150,
    height: 300,
  },
  bookingSuccessContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  bookingSuccessText: {
    ...Typography.h3,
    color: Colors.success,
    textAlign: 'center',
  },

  // Last Mile (Scenario 5)
  lastMileContainer: {
    width: '100%',
  },
  lastMileCard: {
    width: '100%',
  },
  lastMileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  lastMileTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  lastMileOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  lastMileOption: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  lastMileIcon: {
    fontSize: 24,
  },
  lastMileLabel: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  lastMileDetail: {
    ...Typography.small,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
