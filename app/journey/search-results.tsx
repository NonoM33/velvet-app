/**
 * Search Results Screen
 * Train search results with filtering, sorting, and AI predictions
 */
import React, { useState, useEffect, useCallback } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import {
  GlassCard,
  PriceChart,
  BookingModal,
  showToast,
  TrainCard,
  SkeletonTrainCard,
  Chip,
  Button,
} from '../../src/components';
import { useStore } from '../../src/store/store';
import { parisBordeauxTrains } from '../../src/services/mockData';
import { searchTrainsByCityAsync } from '../../src/services/navitia';
import { Train } from '../../src/services/types';
import { Colors, Spacing, Typography, BorderRadius, Shadows, Layout } from '../../src/constants/theme';

type SortOption = 'departure' | 'price' | 'duration';

function formatSearchDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === tomorrow.toDateString()) return 'Demain';
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return 'Demain';
  }
}

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{ from?: string; to?: string; date?: string }>();
  const fromCity = params.from || 'Paris';
  const toCity = params.to || 'Bordeaux';
  const searchDate = params.date || new Date().toISOString();

  const [sortBy, setSortBy] = useState<SortOption>('departure');
  const [showPricePrediction, setShowPricePrediction] = useState(true);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trains, setTrains] = useState<Train[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTrains = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchTrainsByCityAsync(fromCity, toCity);
      setTrains(results.length > 0 ? results : parisBordeauxTrains);
    } catch (err) {
      console.error('Error fetching trains:', err);
      setError('Données hors ligne');
      setTrains(parisBordeauxTrains);
    } finally {
      setIsLoading(false);
    }
  }, [fromCity, toCity]);

  useEffect(() => {
    fetchTrains();
  }, [fetchTrains]);

  const sortedTrains = [...trains].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return a.duration - b.duration;
      default:
        return new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime();
    }
  });

  const handleBack = () => {
    triggerHaptic();
    router.back();
  };

  const handleTrainBook = (train: Train) => {
    triggerHaptic('medium');
    setSelectedTrain(train);
    setBookingModalVisible(true);
  };

  const handleSort = (option: SortOption) => {
    triggerHaptic();
    setSortBy(option);
  };

  const togglePrediction = () => {
    triggerHaptic();
    setShowPricePrediction(!showPricePrediction);
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.route}>{fromCity} → {toCity}</Text>
            <Text style={styles.date}>{formatSearchDate(searchDate)} · 1 voyageur</Text>
          </View>
          <Pressable style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color={Colors.textSecondary} />
          </Pressable>
        </Animated.View>

        {/* Sort & Filter */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            <SortChip
              label="Horaire"
              icon="time"
              isActive={sortBy === 'departure'}
              onPress={() => handleSort('departure')}
            />
            <SortChip
              label="Prix"
              icon="cash"
              isActive={sortBy === 'price'}
              onPress={() => handleSort('price')}
            />
            <SortChip
              label="Durée"
              icon="speedometer"
              isActive={sortBy === 'duration'}
              onPress={() => handleSort('duration')}
            />

            <View style={styles.filterDivider} />

            <SortChip
              label="Prédiction IA"
              icon="analytics"
              isActive={showPricePrediction}
              onPress={togglePrediction}
            />
          </ScrollView>
        </Animated.View>

        {/* Price Prediction Banner */}
        {showPricePrediction && (
          <Animated.View
            entering={FadeInDown.delay(150).duration(400)}
            style={styles.predictionBanner}
          >
            <View style={styles.predictionCard}>
              <View style={styles.predictionIconWrapper}>
                <Ionicons name="trending-down" size={18} color={Colors.success} />
              </View>
              <View style={styles.predictionContent}>
                <Text style={styles.predictionTitle}>Bon moment pour acheter</Text>
                <Text style={styles.predictionSubtitle}>Prix 15% sous la moyenne</Text>
              </View>
              <PriceChart
                data={[45, 52, 48, 42, 38, 35, 29]}
                currentPrice={29}
                trend="down"
                width={72}
                height={28}
              />
            </View>
          </Animated.View>
        )}

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {isLoading ? 'Recherche...' : `${sortedTrains.length} trains`}
          </Text>
          {error && (
            <View style={styles.offlineBadge}>
              <Ionicons name="cloud-offline-outline" size={12} color={Colors.warning} />
              <Text style={styles.offlineText}>Hors ligne</Text>
            </View>
          )}
        </View>

        {/* Results List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Loading Skeletons */}
          {isLoading && (
            <View style={styles.skeletonList}>
              {[1, 2, 3].map((i) => (
                <SkeletonTrainCard key={i} />
              ))}
            </View>
          )}

          {/* Train Results */}
          {!isLoading && sortedTrains.map((train, index) => (
            <Animated.View
              key={train.id}
              entering={FadeInDown.delay(index * 60).duration(300)}
              style={styles.cardWrapper}
            >
              <TrainCard
                train={train}
                onPress={() => handleTrainBook(train)}
                showRecommendation={showPricePrediction}
              />
            </Animated.View>
          ))}

          {/* Load More */}
          {!isLoading && sortedTrains.length > 0 && (
            <View style={styles.loadMore}>
              <Button
                title="Actualiser"
                onPress={() => {
                  showToast('Actualisation...', 'info');
                  fetchTrains();
                }}
                variant="ghost"
                icon="refresh"
                size="sm"
              />
            </View>
          )}

          {/* Empty State */}
          {!isLoading && sortedTrains.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="train-outline" size={40} color={Colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Aucun train trouvé</Text>
              <Text style={styles.emptySubtitle}>Modifiez votre recherche</Text>
              <Button
                title="Nouvelle recherche"
                onPress={handleBack}
                variant="primary"
                style={{ marginTop: Spacing.md }}
              />
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      <BookingModal
        visible={bookingModalVisible}
        train={selectedTrain}
        onClose={() => setBookingModalVisible(false)}
        onConfirm={(train) => console.log('Booked:', train.trainNumber)}
      />
    </LinearGradient>
  );
}

// Sort Chip Component
interface SortChipProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive: boolean;
  onPress: () => void;
}

function SortChip({ label, icon, isActive, onPress }: SortChipProps) {
  return (
    <Pressable onPress={onPress}>
      {isActive ? (
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.chipActive}
        >
          <Ionicons name={icon} size={14} color="#FFF" />
          <Text style={styles.chipTextActive}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.chip}>
          <Ionicons name={`${icon}-outline` as any} size={14} color={Colors.textTertiary} />
          <Text style={styles.chipText}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

// Haptic helper
function triggerHaptic(type: 'light' | 'medium' = 'light') {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(
    type === 'light' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
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
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.smd,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.smd,
  },
  headerContent: {
    flex: 1,
  },
  route: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  date: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.smd,
    gap: Spacing.sm,
  },
  chipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.smd,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  chipTextActive: {
    ...Typography.captionMedium,
    color: '#FFF',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.smd,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  filterDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.xs,
    alignSelf: 'center',
  },
  predictionBanner: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.smd,
  },
  predictionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.smd,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  predictionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.successMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.smd,
  },
  predictionContent: {
    flex: 1,
  },
  predictionTitle: {
    ...Typography.calloutMedium,
    color: Colors.success,
  },
  predictionSubtitle: {
    ...Typography.footnote,
    color: Colors.textTertiary,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.sm,
  },
  resultsCount: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningMuted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  offlineText: {
    ...Typography.micro,
    color: Colors.warning,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xl,
  },
  skeletonList: {
    gap: Spacing.md,
  },
  cardWrapper: {
    marginBottom: Spacing.md,
  },
  loadMore: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});
