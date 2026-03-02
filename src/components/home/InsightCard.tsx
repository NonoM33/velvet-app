/**
 * InsightCard Component
 * AI-powered insights displayed as horizontal scrollable cards
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform, ScrollView } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Spacing, Shadows, Motion } from '../../constants/theme';

interface Insight {
  id: string;
  text: string;
  detail: string;
  icon: string;
  cta: string;
}

interface InsightCardProps {
  insight: Insight;
  delay?: number;
  onAction: () => void;
}

export function InsightCard({ insight, delay = 0, onAction }: InsightCardProps) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onAction();
  };

  return (
    <Animated.View entering={FadeInRight.delay(delay).springify()}>
      <Pressable onPress={handlePress} style={styles.card}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[Colors.primaryGhost, Colors.surface]}
            style={styles.iconGradient}
          >
            <Ionicons
              name={insight.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={Colors.primary}
            />
          </LinearGradient>
        </View>

        {/* Content */}
        <Text style={styles.text} numberOfLines={2}>{insight.text}</Text>
        <Text style={styles.detail}>{insight.detail}</Text>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaText}>{insight.cta}</Text>
          <Ionicons name="arrow-forward" size={12} color={Colors.primary} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Insights Container
interface InsightsContainerProps {
  insights: Insight[];
  onInsightAction: (insightId: string) => void;
}

export function InsightsContainer({ insights, onInsightAction }: InsightsContainerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Insights IA</Text>
        </View>
        <Pressable style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {insights.map((insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            delay={index * 60}
            onAction={() => onInsightAction(insight.id)}
          />
        ))}
      </ScrollView>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
  },
  seeAllText: {
    ...Typography.captionMedium,
    color: Colors.primary,
  },
  scrollContent: {
    paddingRight: Spacing.md,
    gap: Spacing.smd,
  },
  card: {
    width: 156,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.smd,
    gap: Spacing.xs,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    marginBottom: Spacing.xs,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  detail: {
    ...Typography.footnote,
    color: Colors.success,
    fontWeight: '600',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  ctaText: {
    ...Typography.footnoteMedium,
    color: Colors.primary,
  },
});
