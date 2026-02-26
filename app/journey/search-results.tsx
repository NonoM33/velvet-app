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
import Animated, { FadeIn, FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard, PriceChart, BookingModal, showToast } from '../../src/components';
import { useStore } from '../../src/store/store';
import { parisBordeauxTrains } from '../../src/services/mockData';
import { formatTime } from '../../src/services/navitia';
import { Train } from '../../src/services/types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/constants/theme';

type SortOption = 'departure' | 'price' | 'duration';

export default function SearchResultsScreen() {
  const [sortBy, setSortBy] = useState<SortOption>('departure');
  const [showPricePrediction, setShowPricePrediction] = useState(true);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);

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

  const handleTrainBook = (train: Train) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedTrain(train);
    setBookingModalVisible(true);
  };

  const handleBookingConfirm = (train: Train) => {
    console.log('Booked train:', train.trainNumber);
    // Would add to store here
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
                {sortBy === option ? (
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.pillGradient}
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
                      color="#fff"
                    />
                    <Text style={styles.pillTextActive}>
                      {option === 'departure'
                        ? 'Horaire'
                        : option === 'price'
                        ? 'Prix'
                        : 'Durée'}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.pillInner}>
                    <Ionicons
                      name={
                        option === 'departure'
                          ? 'time-outline'
                          : option === 'price'
                          ? 'cash-outline'
                          : 'speedometer-outline'
                      }
                      size={14}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.pillText}>
                      {option === 'departure'
                        ? 'Horaire'
                        : option === 'price'
                        ? 'Prix'
                        : 'Durée'}
                    </Text>
                  </View>
                )}
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
              {showPricePrediction ? (
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.pillGradient}
                >
                  <Ionicons name="analytics" size={14} color="#fff" />
                  <Text style={styles.pillTextActive}>Prédiction IA</Text>
                </LinearGradient>
              ) : (
                <View style={styles.pillInner}>
                  <Ionicons name="analytics-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.pillText}>Prédiction IA</Text>
                </View>
              )}
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
                  <View style={styles.predictionIcon}>
                    <Ionicons name="trending-down" size={20} color={Colors.success} />
                  </View>
                  <View style={styles.predictionInfo}>
                    <Text style={styles.predictionTitle}>
                      Bon moment pour acheter!
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
          <View style={styles.confidenceBadge}>
            <Ionicons name="sparkles" size={12} color={Colors.primary} />
            <Text style={styles.confidenceText}>IA Score activé</Text>
          </View>
        </Animated.View>

        {/* Train List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {sortedTrains.map((train, index) => (
            <TrainResultCard
              key={train.id}
              train={train}
              delay={index * 100 + 250}
              onBook={() => handleTrainBook(train)}
              showIAScore={showPricePrediction}
            />
          ))}

          {/* Load More (mock) */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(400)}
            style={styles.loadMore}
          >
            <Pressable
              style={styles.loadMoreButton}
              onPress={() => showToast('Chargement...', 'info')}
            >
              <Text style={styles.loadMoreText}>Voir plus de trains</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.primary} />
            </Pressable>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      {/* Booking Modal */}
      <BookingModal
        visible={bookingModalVisible}
        train={selectedTrain}
        onClose={() => setBookingModalVisible(false)}
        onConfirm={handleBookingConfirm}
      />
    </LinearGradient>
  );
}

// Enhanced Train Card with IA Score
interface TrainResultCardProps {
  train: Train;
  delay: number;
  onBook: () => void;
  showIAScore: boolean;
}

function TrainResultCard({ train, delay, onBook, showIAScore }: TrainResultCardProps) {
  // Generate IA Score (60-100)
  const iaScore = Math.round(60 + (train.pricePrediction?.confidence || 0.7) * 40);
  const scaleValue = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 15 });
  };

  const getPriceColor = () => {
    if (train.price <= 29) return Colors.success;
    if (train.price <= 55) return Colors.warning;
    return Colors.error;
  };

  const getOccupancyInfo = () => {
    switch (train.occupancy) {
      case 'low':
        return { text: 'Peu rempli', color: Colors.success, icon: '🟢' };
      case 'medium':
        return { text: 'Remplissage moyen', color: Colors.warning, icon: '🟡' };
      case 'high':
        return { text: 'Presque complet', color: Colors.error, icon: '🔴' };
      default:
        return { text: 'Inconnu', color: Colors.textMuted, icon: '⚪' };
    }
  };

  const occupancy = getOccupancyInfo();

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()} style={styles.trainCardContainer}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={cardStyle}>
          <View style={styles.trainCard}>
            {/* Header Row */}
            <View style={styles.trainHeader}>
              <View style={styles.trainNumberContainer}>
                <Ionicons name="train" size={14} color={Colors.primary} />
                <Text style={styles.trainNumber}>{train.trainNumber}</Text>
              </View>
              {train.isRecommended && (
                <View style={styles.recommendedBadge}>
                  <Ionicons name="sparkles" size={12} color="#FFF" />
                  <Text style={styles.recommendedText}>Recommandé</Text>
                </View>
              )}
              {showIAScore && (
                <View style={styles.iaScoreBadge}>
                  <Text style={styles.iaScoreLabel}>IA</Text>
                  <Text style={styles.iaScoreValue}>{iaScore}</Text>
                </View>
              )}
            </View>

            {/* Times Row */}
            <View style={styles.timesRow}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeValue}>{formatTime(train.departure.time)}</Text>
                <Text style={styles.stationText}>{train.departure.station.city}</Text>
              </View>
              <View style={styles.durationColumn}>
                <View style={styles.durationLine}>
                  <View style={styles.dot} />
                  <View style={styles.line} />
                  <Ionicons name="train-outline" size={14} color={Colors.primary} />
                  <View style={styles.line} />
                  <View style={[styles.dot, styles.dotFilled]} />
                </View>
                <Text style={styles.durationText}>
                  {Math.floor(train.duration / 60)}h{train.duration % 60 > 0 ? String(train.duration % 60).padStart(2, '0') : ''}
                </Text>
              </View>
              <View style={[styles.timeColumn, styles.timeColumnRight]}>
                <Text style={styles.timeValue}>{formatTime(train.arrival.time)}</Text>
                <Text style={styles.stationText}>{train.arrival.station.city}</Text>
              </View>
            </View>

            {/* IA Score Bar */}
            {showIAScore && (
              <View style={styles.iaScoreBarContainer}>
                <View style={styles.iaScoreBarBackground}>
                  <Animated.View
                    style={[
                      styles.iaScoreBarFill,
                      {
                        width: `${iaScore}%`,
                        backgroundColor: iaScore >= 80 ? Colors.success : iaScore >= 60 ? Colors.warning : Colors.error,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.iaScoreDescription}>
                  {iaScore >= 80 ? 'Excellent choix' : iaScore >= 60 ? 'Bon choix' : 'À considérer'}
                </Text>
              </View>
            )}

            {/* Info Row */}
            <View style={styles.infoRow}>
              <View style={styles.occupancyChip}>
                <Text style={styles.occupancyIcon}>{occupancy.icon}</Text>
                <Text style={[styles.occupancyText, { color: occupancy.color }]}>{occupancy.text}</Text>
              </View>
              <View style={styles.amenitiesRow}>
                {train.amenities.slice(0, 3).map((amenity, i) => {
                  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
                    wifi: 'wifi',
                    power: 'flash',
                    bar: 'cafe',
                    quiet: 'volume-mute',
                  };
                  return (
                    <View key={i} style={styles.amenityIcon}>
                      <Ionicons name={icons[amenity] || 'checkmark'} size={14} color={Colors.textMuted} />
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Price & Book Row */}
            <View style={styles.priceRow}>
              <View style={styles.priceContainer}>
                {train.originalPrice && (
                  <Text style={styles.originalPrice}>{train.originalPrice}€</Text>
                )}
                <Text style={[styles.price, { color: getPriceColor() }]}>{train.price}€</Text>
                {train.priceRecommendation === 'buy_now' && (
                  <View style={styles.buyNowBadge}>
                    <Text style={styles.buyNowText}>Bon prix!</Text>
                  </View>
                )}
              </View>
              <Pressable style={styles.bookButton} onPress={onBook}>
                <LinearGradient
                  colors={[Colors.success, '#059669']}
                  style={styles.bookButtonGradient}
                >
                  <Text style={styles.bookButtonText}>Réserver</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
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
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
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
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  pillActive: {},
  pillGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  pillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: BorderRadius.full,
  },
  pillText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  pillTextActive: {
    ...Typography.captionBold,
    color: '#fff',
  },
  pillDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.xs,
    alignSelf: 'center',
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
    backgroundColor: Colors.successLight,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  resultsText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.aiGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  confidenceText: {
    ...Typography.small,
    color: Colors.primary,
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
  trainCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  trainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  trainNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  trainNumber: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  recommendedText: {
    ...Typography.small,
    color: '#FFF',
    fontWeight: '600',
  },
  iaScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.aiGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  iaScoreLabel: {
    ...Typography.small,
    color: Colors.primary,
  },
  iaScoreValue: {
    ...Typography.smallBold,
    color: Colors.primary,
  },
  timesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  timeColumn: {
    flex: 1,
  },
  timeColumnRight: {
    alignItems: 'flex-end',
  },
  timeValue: {
    ...Typography.h3,
    color: Colors.navy,
  },
  stationText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  durationColumn: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  durationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  dotFilled: {
    backgroundColor: Colors.primary,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.divider,
  },
  durationText: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  iaScoreBarContainer: {
    marginBottom: Spacing.sm,
  },
  iaScoreBarBackground: {
    height: 4,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  iaScoreBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  iaScoreDescription: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  occupancyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  occupancyIcon: {
    fontSize: 12,
  },
  occupancyText: {
    ...Typography.small,
  },
  amenitiesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  amenityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  originalPrice: {
    ...Typography.body,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  price: {
    ...Typography.h2,
    fontWeight: '700',
  },
  buyNowBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  buyNowText: {
    ...Typography.small,
    color: Colors.success,
    fontWeight: '600',
  },
  bookButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  bookButtonText: {
    ...Typography.bodyBold,
    color: '#FFF',
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
    color: Colors.primary,
  },
  bottomSpacer: {
    height: 40,
  },
});
