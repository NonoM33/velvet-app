/**
 * DisruptionCard Components
 * Live disruption alerts with AI-powered alternatives
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { Button } from '../ui/Button';
import { LiveBadge, PulsingDot } from '../ui/index';
import type { Disruption as NavitiaDisruption } from '../../services/navitia';

// Local mock disruption type
interface MockDisruption {
  id: string;
  route: string;
  trainNumber: string;
  delay: number;
  alternativeTrain: string;
  alternativeTime: string;
  priceDiff: number;
  sameArrival: boolean;
}

// ============= DISRUPTION SECTION HEADER =============
interface DisruptionHeaderProps {
  hasDisruptions: boolean;
}

export function DisruptionHeader({ hasDisruptions }: DisruptionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Perturbations</Text>
      <View style={styles.liveIndicator}>
        <PulsingDot color={hasDisruptions ? Colors.error : Colors.success} size={6} />
        <Text style={[styles.liveText, { color: hasDisruptions ? Colors.error : Colors.success }]}>
          {hasDisruptions ? 'ALERTES' : 'OK'}
        </Text>
      </View>
    </View>
  );
}

// ============= MOCK DISRUPTION CARD =============
interface DisruptionCardProps {
  disruption: MockDisruption;
  delay?: number;
  onSwap: () => void;
}

export function DisruptionCard({ disruption, delay = 0, onSwap }: DisruptionCardProps) {
  const handleSwap = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onSwap();
  };

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <View style={styles.card}>
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={20} color={Colors.warning} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {disruption.route}
            </Text>
            <View style={styles.delayBadge}>
              <Text style={styles.delayText}>+{disruption.delay}min</Text>
            </View>
          </View>

          <Text style={styles.trainNumber}>{disruption.trainNumber}</Text>

          {/* AI Solution */}
          <View style={styles.aiSolution}>
            <View style={styles.aiIconWrapper}>
              <Ionicons name="sparkles" size={12} color={Colors.primary} />
            </View>
            <Text style={styles.aiSolutionText} numberOfLines={2}>
              Alternative: {disruption.alternativeTrain} à {disruption.alternativeTime}
              {disruption.sameArrival ? ' (même arrivée)' : ''}
              {disruption.priceDiff > 0 ? ` +${disruption.priceDiff}€` : ''}
            </Text>
          </View>
        </View>

        {/* Action */}
        <Pressable style={styles.swapButton} onPress={handleSwap}>
          <Text style={styles.swapButtonText}>Changer</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFF" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ============= LIVE DISRUPTION CARD (API data) =============
interface LiveDisruptionCardProps {
  disruption: NavitiaDisruption;
  delay?: number;
}

export function LiveDisruptionCard({ disruption, delay = 0 }: LiveDisruptionCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <View style={styles.card}>
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={20} color={Colors.warning} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {disruption.title}
          </Text>

          {disruption.affectedLines.length > 0 && (
            <Text style={styles.trainNumber} numberOfLines={1}>
              Lignes: {disruption.affectedLines.slice(0, 3).join(', ')}
            </Text>
          )}

          {/* Info */}
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={14} color={Colors.info} />
            <Text style={styles.infoText} numberOfLines={2}>
              {disruption.message?.substring(0, 100) || 'Consultez les horaires pour les alternatives'}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ============= NO DISRUPTIONS CARD =============
interface NoDisruptionsCardProps {
  isLoading?: boolean;
}

export function NoDisruptionsCard({ isLoading = false }: NoDisruptionsCardProps) {
  return (
    <View style={styles.noDisruptionsCard}>
      {isLoading ? (
        <>
          <View style={styles.loadingIcon}>
            <Ionicons name="refresh" size={20} color={Colors.textMuted} />
          </View>
          <Text style={styles.noDisruptionsText}>Vérification en cours...</Text>
        </>
      ) : (
        <>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          </View>
          <Text style={styles.noDisruptionsText}>Trafic normal</Text>
          <Text style={styles.noDisruptionsSubtext}>
            Aucune perturbation sur vos lignes
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.smd,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  liveText: {
    ...Typography.micro,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.smd,
    marginBottom: Spacing.sm,
    gap: Spacing.smd,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.warningMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.calloutMedium,
    color: Colors.textPrimary,
    flex: 1,
  },
  delayBadge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  delayText: {
    ...Typography.micro,
    color: Colors.warning,
    fontWeight: '600',
  },
  trainNumber: {
    ...Typography.footnote,
    color: Colors.textTertiary,
  },
  aiSolution: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
    backgroundColor: Colors.primaryGhost,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  aiIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSolutionText: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    flex: 1,
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.smd,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  swapButtonText: {
    ...Typography.captionMedium,
    color: '#FFF',
  },
  noDisruptionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.successMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDisruptionsText: {
    ...Typography.calloutMedium,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  noDisruptionsSubtext: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
