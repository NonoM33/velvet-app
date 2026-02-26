import React from 'react';
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
import { GlassCard, OccupancyGauge, PriceChart } from '../../src/components';
import { useStore } from '../../src/store/store';
import { formatTime, formatDate, formatDuration, getCountdown } from '../../src/services/navitia';
import { parisBordeauxTrains, weatherData } from '../../src/services/mockData';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { Train, Trip } from '../../src/services/types';

export default function JourneyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { upcomingTrips, pastTrips } = useStore();

  // Find trip or train
  const trip = [...upcomingTrips, ...pastTrips].find((t) => t.id === id);
  const train = trip?.train || parisBordeauxTrains.find((t) => t.id === id);

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleBook = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // Mock booking action
    router.back();
  };

  if (!train) {
    return (
      <LinearGradient
        colors={[Colors.background, Colors.backgroundSecondary, Colors.background]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Voyage introuvable</Text>
            <Pressable onPress={handleBack} style={styles.errorButton}>
              <Text style={styles.errorButtonText}>Retour</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const countdown = train?.departure?.time ? getCountdown(train.departure.time) : null;
  const destinationCity = train?.arrival?.station?.city?.toLowerCase() ?? '';
  const weather = destinationCity ? (weatherData[destinationCity] ?? null) : null;

  const getPriceColor = () => {
    if (train.price <= 29) return Colors.priceGreen;
    if (train.price <= 55) return Colors.priceOrange;
    return Colors.priceRed;
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundSecondary, Colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Détails du voyage</Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Journey Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <GlassCard animated={false}>
              <View style={styles.journeyCard}>
                {/* Route Header */}
                <View style={styles.routeHeader}>
                  <Text style={styles.routeText}>
                    {train?.departure?.station?.city ?? 'N/A'} → {train?.arrival?.station?.city ?? 'N/A'}
                  </Text>
                  <OccupancyGauge level={train?.occupancy ?? 'medium'} />
                </View>

                <Text style={styles.dateText}>
                  {formatDate(train?.departure?.time ?? '')}
                </Text>

                {/* Times */}
                <View style={styles.timesContainer}>
                  <View style={styles.timeSection}>
                    <Text style={styles.timeLabel}>Départ</Text>
                    <Text style={styles.time}>{formatTime(train?.departure?.time ?? '')}</Text>
                    <Text style={styles.station}>{train?.departure?.station?.name ?? 'N/A'}</Text>
                    {train?.departure?.platform && (
                      <View style={styles.platformBadge}>
                        <Text style={styles.platformText}>
                          Voie {train.departure.platform}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.journeyLine}>
                    <View style={styles.lineDot} />
                    <View style={styles.lineVertical} />
                    <View style={styles.durationBadge}>
                      <Ionicons name="train" size={16} color={Colors.primaryDark} />
                      <Text style={styles.durationText}>
                        {formatDuration(train?.duration ?? 0)}
                      </Text>
                    </View>
                    <View style={styles.lineVertical} />
                    <View style={styles.lineDot} />
                  </View>

                  <View style={[styles.timeSection, styles.timeSectionRight]}>
                    <Text style={styles.timeLabel}>Arrivée</Text>
                    <Text style={styles.time}>{formatTime(train?.arrival?.time ?? '')}</Text>
                    <Text style={styles.station}>{train?.arrival?.station?.name ?? 'N/A'}</Text>
                    {train?.arrival?.platform && (
                      <View style={styles.platformBadge}>
                        <Text style={styles.platformText}>
                          Voie {train.arrival.platform}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Train Info */}
                <View style={styles.trainInfo}>
                  <View style={styles.trainBadge}>
                    <Text style={styles.trainNumber}>{train?.trainNumber ?? 'N/A'}</Text>
                  </View>
                  <View style={styles.amenities}>
                    {train?.amenities?.includes('wifi') && (
                      <View style={styles.amenityBadge}>
                        <Ionicons name="wifi" size={14} color={Colors.textSecondary} />
                        <Text style={styles.amenityText}>WiFi</Text>
                      </View>
                    )}
                    {train?.amenities?.includes('power') && (
                      <View style={styles.amenityBadge}>
                        <Ionicons name="flash" size={14} color={Colors.textSecondary} />
                        <Text style={styles.amenityText}>Prise</Text>
                      </View>
                    )}
                    {train?.amenities?.includes('bar') && (
                      <View style={styles.amenityBadge}>
                        <Ionicons
                          name="restaurant"
                          size={14}
                          color={Colors.textSecondary}
                        />
                        <Text style={styles.amenityText}>Bar</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Countdown (for upcoming trips) */}
          {countdown && countdown.days <= 7 && !trip?.status?.includes('completed') && (
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              <GlassCard animated={false}>
                <View style={styles.countdownCard}>
                  <LinearGradient
                    colors={[Colors.primary + '30', Colors.primaryDark + '30']}
                    style={styles.countdownIcon}
                  >
                    <Ionicons name="time" size={24} color={Colors.primaryDark} />
                  </LinearGradient>
                  <View style={styles.countdownInfo}>
                    <Text style={styles.countdownTitle}>
                      {countdown.isToday
                        ? "C'est aujourd'hui !"
                        : countdown.isTomorrow
                        ? 'Demain !'
                        : `Dans ${countdown.days} jour${countdown.days > 1 ? 's' : ''}`}
                    </Text>
                    <Text style={styles.countdownDetail}>
                      {countdown.isToday
                        ? `Départ dans ${countdown.hours}h ${countdown.minutes}min`
                        : `Préparez votre voyage !`}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {/* Ticket (for booked trips) */}
          {trip?.ticketCode && (
            <Animated.View entering={FadeInDown.delay(250).duration(400)}>
              <Text style={styles.sectionTitle}>🎫 Votre billet</Text>
              <GlassCard animated={false}>
                <View style={styles.ticketCard}>
                  <View style={styles.qrContainer}>
                    <View style={styles.qrPlaceholder}>
                      <Ionicons name="qr-code" size={80} color={Colors.textMuted} />
                    </View>
                  </View>
                  <View style={styles.ticketDetails}>
                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Code</Text>
                      <Text style={styles.ticketValue}>{trip.ticketCode}</Text>
                    </View>
                    <View style={styles.ticketDivider} />
                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Voiture</Text>
                      <Text style={styles.ticketValue}>{trip.coach}</Text>
                    </View>
                    <View style={styles.ticketDivider} />
                    <View style={styles.ticketRow}>
                      <Text style={styles.ticketLabel}>Place</Text>
                      <Text style={styles.ticketValue}>{trip.seat}</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {/* Price Prediction (for non-booked trains) */}
          {!trip && train?.pricePrediction && (
            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
              <Text style={styles.sectionTitle}>📊 Prédiction de prix</Text>
              <GlassCard animated={false}>
                <View style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <View style={styles.predictionPrice}>
                      <Text style={[styles.currentPrice, { color: getPriceColor() }]}>
                        {train.price}€
                      </Text>
                      {train.originalPrice && train.originalPrice > train.price && (
                        <Text style={styles.originalPrice}>{train.originalPrice}€</Text>
                      )}
                    </View>
                    <PriceChart
                      data={[45, 52, 48, 42, 38, 35, train.price]}
                      currentPrice={train.price}
                      trend={train.pricePrediction.trend}
                      width={100}
                      height={40}
                    />
                  </View>

                  <View style={styles.recommendationBox}>
                    <LinearGradient
                      colors={
                        train?.priceRecommendation === 'buy_now'
                          ? [Colors.success + '20', Colors.success + '20']
                          : train?.priceRecommendation === 'wait'
                          ? [Colors.warning + '20', Colors.warning + '20']
                          : [Colors.divider, Colors.divider]
                      }
                      style={styles.recommendationGradient}
                    >
                      <Ionicons
                        name={
                          train?.priceRecommendation === 'buy_now'
                            ? 'checkmark-circle'
                            : train?.priceRecommendation === 'wait'
                            ? 'time'
                            : 'help-circle'
                        }
                        size={20}
                        color={
                          train?.priceRecommendation === 'buy_now'
                            ? Colors.success
                            : train?.priceRecommendation === 'wait'
                            ? Colors.warning
                            : Colors.textMuted
                        }
                      />
                      <View style={styles.recommendationText}>
                        <Text
                          style={[
                            styles.recommendationTitle,
                            {
                              color:
                                train?.priceRecommendation === 'buy_now'
                                  ? Colors.success
                                  : train?.priceRecommendation === 'wait'
                                  ? Colors.warning
                                  : Colors.textSecondary,
                            },
                          ]}
                        >
                          {train?.priceRecommendation === 'buy_now'
                            ? 'Achetez maintenant !'
                            : train?.priceRecommendation === 'wait'
                            ? 'Attendez quelques jours'
                            : 'Prix stable'}
                        </Text>
                        <Text style={styles.recommendationDetail}>
                          {train?.priceRecommendation === 'buy_now'
                            ? `${Math.round((train?.pricePrediction?.confidence ?? 0) * 100)}% de chances que le prix augmente`
                            : train?.priceRecommendation === 'wait'
                            ? `Prix prévu: ${train?.pricePrediction?.predictedPrice ?? 'N/A'}€`
                            : 'Le prix devrait rester stable'}
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {/* Weather at Destination */}
          {weather && (
            <Animated.View entering={FadeInDown.delay(350).duration(400)}>
              <Text style={styles.sectionTitle}>
                ☀️ Météo à {train?.arrival?.station?.city ?? 'destination'}
              </Text>
              <GlassCard animated={false}>
                <View style={styles.weatherCard}>
                  <Text style={styles.weatherIcon}>{weather.icon}</Text>
                  <View style={styles.weatherInfo}>
                    <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
                    <Text style={styles.weatherDesc}>{weather.description}</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Book Button (for non-booked trains) */}
        {!trip && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={styles.bookContainer}
          >
            <Pressable onPress={handleBook} style={styles.bookButton}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bookGradient}
              >
                <View style={styles.bookContent}>
                  <View>
                    <Text style={styles.bookPrice}>{train?.price ?? 'N/A'}€</Text>
                    <Text style={styles.bookLabel}>par personne</Text>
                  </View>
                  <View style={styles.bookAction}>
                    <Text style={styles.bookText}>Réserver</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  errorButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.full,
  },
  errorButtonText: {
    ...Typography.bodyBold,
    color: '#fff',
  },
  journeyCard: {
    gap: Spacing.md,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeText: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  dateText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  timesContainer: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
  },
  timeSection: {
    flex: 1,
  },
  timeSectionRight: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    ...Typography.small,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  time: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  station: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  platformBadge: {
    backgroundColor: Colors.primaryDark + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  platformText: {
    ...Typography.small,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  journeyLine: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  lineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryDark,
  },
  lineVertical: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.divider,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.xs,
  },
  durationText: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  trainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  trainBadge: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  trainNumber: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  amenities: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  amenityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amenityText: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  countdownIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownInfo: {
    flex: 1,
  },
  countdownTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  countdownDetail: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ticketCard: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  qrContainer: {
    padding: Spacing.md,
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketDetails: {
    width: '100%',
    gap: Spacing.sm,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  ticketValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  ticketDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  predictionCard: {
    gap: Spacing.md,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  currentPrice: {
    ...Typography.h1,
    fontWeight: '700',
  },
  originalPrice: {
    ...Typography.body,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  recommendationBox: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  recommendationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  recommendationText: {
    flex: 1,
  },
  recommendationTitle: {
    ...Typography.bodyBold,
  },
  recommendationDetail: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  weatherIcon: {
    fontSize: 48,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  weatherDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bottomSpacer: {
    height: 120,
  },
  bookContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  bookButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  bookGradient: {
    padding: Spacing.md,
  },
  bookContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookPrice: {
    ...Typography.h2,
    color: '#fff',
  },
  bookLabel: {
    ...Typography.small,
    color: 'rgba(255,255,255,0.7)',
  },
  bookAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bookText: {
    ...Typography.h3,
    color: '#fff',
  },
});
