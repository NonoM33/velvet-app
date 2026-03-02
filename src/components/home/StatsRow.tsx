/**
 * StatsRow Component
 * Animated statistics display with counters
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { AnimatedCounter } from '../AnimatedCounter';

interface StatItem {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  value: number;
  suffix?: string;
  label: string;
}

interface StatsRowProps {
  stats: {
    moneySaved: number;
    totalTrips: number;
    co2Avoided: number;
  };
}

export function StatsRow({ stats }: StatsRowProps) {
  const statItems: StatItem[] = [
    {
      icon: 'wallet-outline',
      iconColor: Colors.success,
      iconBgColor: Colors.successMuted,
      value: stats.moneySaved,
      suffix: '€',
      label: 'Économisés',
    },
    {
      icon: 'train-outline',
      iconColor: Colors.primary,
      iconBgColor: Colors.primaryGhost,
      value: stats.totalTrips,
      label: 'Voyages',
    },
    {
      icon: 'leaf-outline',
      iconColor: Colors.success,
      iconBgColor: Colors.successMuted,
      value: stats.co2Avoided,
      suffix: 'kg',
      label: 'CO₂ évité',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Vos économies</Text>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={10} color={Colors.primary} />
          <Text style={styles.aiBadgeText}>Grâce à l'IA</Text>
        </View>
      </View>

      <View style={styles.row}>
        {statItems.map((item, index) => (
          <Animated.View
            key={item.label}
            entering={FadeInDown.delay(100 + index * 80).springify()}
            style={styles.statCard}
          >
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: item.iconBgColor },
              ]}
            >
              <Ionicons name={item.icon} size={18} color={item.iconColor} />
            </View>

            <AnimatedCounter
              value={item.value}
              suffix={item.suffix}
              style={styles.statValue}
            />

            <Text style={styles.statLabel}>{item.label}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

// Compact single stat display
interface CompactStatProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
  color?: string;
}

export function CompactStat({
  icon,
  value,
  label,
  color = Colors.primary,
}: CompactStatProps) {
  return (
    <View style={styles.compactStat}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={styles.compactValue}>{value}</Text>
      <Text style={styles.compactLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.smd,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryGhost,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  aiBadgeText: {
    ...Typography.micro,
    color: Colors.primary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.smd,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  compactStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactValue: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
  },
  compactLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});
