import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard, TrainCard, PriceChart } from '../../src/components';
import { useStore } from '../../src/store/store';
import { parisBordeauxTrains } from '../../src/services/mockData';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

type SortOption = 'departure' | 'price' | 'duration';
type FilterOption = 'all' | 'direct' | 'morning' | 'afternoon';

export default function SearchResultsScreen() {
  const [sortBy, setSortBy] = useState<SortOption>('departure');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showPricePrediction, setShowPricePrediction] = useState(true);

  // Using mock data for Paris → Bordeaux
  const trains = parisBordeauxTrains;

  const sortedTrains = [...trains].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return a.duration - b.duration;
      case 'departure':
      default:
        return new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime();
    }
  });

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleTrainSelect = (trainId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(`/journey/${trainId}`);
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundLight, Colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.route}>Paris → Bordeaux</Text>
            <Text style={styles.date}>Demain • 1 voyageur</Text>
          </View>
          <Pressable style={styles.filterButton}>
            <Ionicons name="options" size={20} color={Colors.textMuted} />
          </Pressable>
        </Animated.View>

        {/* Sort & Filter Pills */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContainer}
          >
            {/* Sort Options */}
            {(['departure', 'price', 'duration'] as SortOption[]).map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSortBy(option);
                }}
                style={[styles.pill, sortBy === option && styles.pillActive]}
              >
                <Ionicons
                  name={
                    option === 'departure'
                      ? 'time'
                      : option === 'price'
                      ? 'cash'
                      : 'speedometer'
                  }
                  size={14}
                  color={sortBy === option ? '#fff' : Colors.textMuted}
                />
                <Text
                  style={[styles.pillText, sortBy === option && styles.pillTextActive]}
                >
                  {option === 'departure'
                    ? 'Horaire'
                    : option === 'price'
                    ? 'Prix'
                    : 'Durée'}
                </Text>
              </Pressable>
            ))}

            <View style={styles.pillDivider} />

            {/* Price Prediction Toggle */}
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setShowPricePrediction(!showPricePrediction);
              }}
              style={[styles.pill, showPricePrediction && styles.pillActive]}
            >
              <Ionicons
                name="analytics"
                size={14}
                color={showPricePrediction ? '#fff' : Colors.textMuted}
              />
              <Text
                style={[
                  styles.pillText,
                  showPricePrediction && styles.pillTextActive,
                ]}
              >
                Prédiction prix
              </Text>
            </Pressable>
          </ScrollView>
        </Animated.View>

        {/* Price Prediction Summary */}
        {showPricePrediction && (
          <Animated.View
            entering={FadeInDown.delay(150).duration(400)}
            style={styles.predictionContainer}
          >
            <GlassCard animated={false}>
              <View style={styles.predictionContent}>
                <View style={styles.predictionHeader}>
                  <LinearGradient
                    colors={[Colors.success + '30', Colors.success + '30']}
                    style={styles.predictionIcon}
                  >
                    <Ionicons name="trending-down" size={20} color={Colors.success} />
                  </LinearGradient>
                  <View style={styles.predictionInfo}>
                    <Text style={styles.predictionTitle}>
                      Bon moment pour acheter ! 🎯
                    </Text>
                    <Text style={styles.predictionText}>
                      Les prix sont 15% en-dessous de la moyenne
                    </Text>
                  </View>
                </View>
                <PriceChart
                  data={[45, 52, 48, 42, 38, 35, 29]}
                  currentPrice={29}
                  trend="down"
                  width={80}
                  height={32}
                />
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {/* Results Count */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.resultsCount}
        >
          <Text style={styles.resultsText}>
            {sortedTrains.length} trains trouvés
          </Text>
        </Animated.View>

        {/* Train List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {sortedTrains.map((train, index) => (
            <View key={train.id} style={styles.trainCardContainer}>
              <TrainCard
                train={train}
                onPress={() => handleTrainSelect(train.id)}
                delay={index * 100 + 250}
              />
            </View>
          ))}

          {/* Load More (mock) */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(400)}
            style={styles.loadMore}
          >
            <Pressable style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>Voir plus de trains</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.primaryEnd} />
            </Pressable>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  route: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  filterButton: {
    padding: Spacing.xs,
  },
  pillsContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  pillActive: {
    backgroundColor: Colors.primaryEnd,
    borderColor: Colors.primaryEnd,
  },
  pillText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  pillDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.glassBorder,
    marginHorizontal: Spacing.xs,
  },
  predictionContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  predictionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  predictionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionInfo: {
    flex: 1,
  },
  predictionTitle: {
    ...Typography.bodyBold,
    color: Colors.success,
  },
  predictionText: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  resultsCount: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  resultsText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  trainCardContainer: {
    marginBottom: Spacing.md,
  },
  loadMore: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  loadMoreText: {
    ...Typography.body,
    color: Colors.primaryEnd,
  },
  bottomSpacer: {
    height: 40,
  },
});
