import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard, AnimatedCounter } from '../../src/components';
import { useStore } from '../../src/store/store';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

export default function ProfileScreen() {
  const { user, setUser } = useStore();

  const handleToggle = (key: keyof typeof user.preferences.notifications) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        notifications: {
          ...user.preferences.notifications,
          [key]: !user.preferences.notifications[key],
        },
      },
    });
  };

  const handlePreferenceChange = (
    key: 'seatPreference' | 'quietCoach' | 'defaultClass',
    value: any
  ) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        [key]: value,
      },
    });
  };

  const getTierColor = () => {
    switch (user.tier) {
      case 'Platinum':
        return ['#E5E4E2', '#A9A9A9'];
      case 'Gold':
        return ['#FFD700', '#FFA500'];
      case 'Silver':
        return ['#C0C0C0', '#A8A8A8'];
      default:
        return ['#CD7F32', '#8B4513'];
    }
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundLight, Colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header / Profile Card */}
          <Animated.View entering={FadeIn.duration(500)}>
            <GlassCard animated={false}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={[Colors.primaryStart, Colors.primaryEnd]}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                  <LinearGradient
                    colors={getTierColor() as [string, string]}
                    style={styles.tierBadge}
                  >
                    <Ionicons name="star" size={10} color="#000" />
                  </LinearGradient>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.email}>{user.email}</Text>
                  <View style={styles.tierContainer}>
                    <LinearGradient
                      colors={getTierColor() as [string, string]}
                      style={styles.tierLabel}
                    >
                      <Text style={styles.tierText}>Membre {user.tier}</Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Stats Dashboard */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.sectionTitle}>📊 Vos statistiques</Text>
            <View style={styles.statsGrid}>
              <GlassCard style={styles.statCard} delay={0}>
                <View style={styles.statContent}>
                  <LinearGradient
                    colors={[Colors.primaryStart + '30', Colors.primaryEnd + '30']}
                    style={styles.statIcon}
                  >
                    <Ionicons name="train" size={20} color={Colors.primaryEnd} />
                  </LinearGradient>
                  <AnimatedCounter
                    value={user.stats.totalTrips}
                    style={styles.statValue}
                  />
                  <Text style={styles.statLabel}>Voyages</Text>
                </View>
              </GlassCard>

              <GlassCard style={styles.statCard} delay={100}>
                <View style={styles.statContent}>
                  <LinearGradient
                    colors={[Colors.success + '30', Colors.success + '30']}
                    style={styles.statIcon}
                  >
                    <Ionicons name="cash" size={20} color={Colors.success} />
                  </LinearGradient>
                  <AnimatedCounter
                    value={user.stats.moneySaved}
                    suffix="€"
                    style={styles.statValue}
                  />
                  <Text style={styles.statLabel}>Économisés</Text>
                </View>
              </GlassCard>

              <GlassCard style={styles.statCard} delay={200}>
                <View style={styles.statContent}>
                  <LinearGradient
                    colors={[Colors.info + '30', Colors.info + '30']}
                    style={styles.statIcon}
                  >
                    <Ionicons name="navigate" size={20} color={Colors.info} />
                  </LinearGradient>
                  <AnimatedCounter
                    value={Math.round(user.stats.totalDistance / 1000)}
                    suffix="k"
                    style={styles.statValue}
                  />
                  <Text style={styles.statLabel}>Km parcourus</Text>
                </View>
              </GlassCard>

              <GlassCard style={styles.statCard} delay={300}>
                <View style={styles.statContent}>
                  <LinearGradient
                    colors={[Colors.gold + '30', Colors.gold + '30']}
                    style={styles.statIcon}
                  >
                    <Ionicons name="leaf" size={20} color={Colors.gold} />
                  </LinearGradient>
                  <AnimatedCounter
                    value={user.stats.co2Avoided}
                    suffix="kg"
                    style={styles.statValue}
                  />
                  <Text style={styles.statLabel}>CO₂ évité</Text>
                </View>
              </GlassCard>
            </View>

            {/* Favorite Route */}
            {user.stats.favoriteRoute && (
              <GlassCard delay={400}>
                <View style={styles.favoriteRoute}>
                  <View style={styles.favoriteIcon}>
                    <Ionicons name="heart" size={20} color={Colors.error} />
                  </View>
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteLabel}>Trajet favori</Text>
                    <Text style={styles.favoriteText}>
                      {user.stats.favoriteRoute.origin} →{' '}
                      {user.stats.favoriteRoute.destination}
                    </Text>
                  </View>
                  <View style={styles.favoriteCount}>
                    <Text style={styles.favoriteCountText}>
                      {user.stats.favoriteRoute.count}x
                    </Text>
                  </View>
                </View>
              </GlassCard>
            )}
          </Animated.View>

          {/* Preferences */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.sectionTitle}>⚙️ Préférences de voyage</Text>
            <GlassCard animated={false}>
              <View style={styles.preferencesList}>
                {/* Seat Preference */}
                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceInfo}>
                    <Ionicons
                      name="airplane-outline"
                      size={20}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.preferenceLabel}>Place préférée</Text>
                  </View>
                  <View style={styles.segmentedControl}>
                    {(['window', 'aisle', 'no_preference'] as const).map((option) => (
                      <Pressable
                        key={option}
                        onPress={() => handlePreferenceChange('seatPreference', option)}
                        style={[
                          styles.segmentButton,
                          user.preferences.seatPreference === option &&
                            styles.segmentButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.segmentText,
                            user.preferences.seatPreference === option &&
                              styles.segmentTextActive,
                          ]}
                        >
                          {option === 'window'
                            ? 'Fenêtre'
                            : option === 'aisle'
                            ? 'Couloir'
                            : 'Indifférent'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Quiet Coach */}
                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceInfo}>
                    <Ionicons
                      name="volume-mute-outline"
                      size={20}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.preferenceLabel}>Voiture silencieuse</Text>
                  </View>
                  <Switch
                    value={user.preferences.quietCoach}
                    onValueChange={(value) =>
                      handlePreferenceChange('quietCoach', value)
                    }
                    trackColor={{
                      false: Colors.glassBorder,
                      true: Colors.primaryEnd + '80',
                    }}
                    thumbColor={
                      user.preferences.quietCoach ? Colors.primaryEnd : Colors.textMuted
                    }
                  />
                </View>

                <View style={styles.divider} />

                {/* Default Class */}
                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceInfo}>
                    <Ionicons
                      name="ribbon-outline"
                      size={20}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.preferenceLabel}>Classe par défaut</Text>
                  </View>
                  <View style={styles.segmentedControl}>
                    {(['1st', '2nd'] as const).map((option) => (
                      <Pressable
                        key={option}
                        onPress={() => handlePreferenceChange('defaultClass', option)}
                        style={[
                          styles.segmentButton,
                          user.preferences.defaultClass === option &&
                            styles.segmentButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.segmentText,
                            user.preferences.defaultClass === option &&
                              styles.segmentTextActive,
                          ]}
                        >
                          {option === '1st' ? '1ère' : '2nde'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Notifications */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Text style={styles.sectionTitle}>🔔 Notifications</Text>
            <GlassCard animated={false}>
              <View style={styles.preferencesList}>
                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceInfo}>
                    <Ionicons
                      name="pricetag-outline"
                      size={20}
                      color={Colors.textSecondary}
                    />
                    <View>
                      <Text style={styles.preferenceLabel}>Alertes prix</Text>
                      <Text style={styles.preferenceDescription}>
                        Recevez une alerte quand le prix baisse
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={user.preferences.notifications.priceAlerts}
                    onValueChange={() => handleToggle('priceAlerts')}
                    trackColor={{
                      false: Colors.glassBorder,
                      true: Colors.primaryEnd + '80',
                    }}
                    thumbColor={
                      user.preferences.notifications.priceAlerts
                        ? Colors.primaryEnd
                        : Colors.textMuted
                    }
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceInfo}>
                    <Ionicons
                      name="warning-outline"
                      size={20}
                      color={Colors.textSecondary}
                    />
                    <View>
                      <Text style={styles.preferenceLabel}>Perturbations</Text>
                      <Text style={styles.preferenceDescription}>
                        Alertes en cas de retard ou annulation
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={user.preferences.notifications.disruptions}
                    onValueChange={() => handleToggle('disruptions')}
                    trackColor={{
                      false: Colors.glassBorder,
                      true: Colors.primaryEnd + '80',
                    }}
                    thumbColor={
                      user.preferences.notifications.disruptions
                        ? Colors.primaryEnd
                        : Colors.textMuted
                    }
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceInfo}>
                    <Ionicons
                      name="notifications-outline"
                      size={20}
                      color={Colors.textSecondary}
                    />
                    <View>
                      <Text style={styles.preferenceLabel}>Rappels voyage</Text>
                      <Text style={styles.preferenceDescription}>
                        Rappel 24h et 1h avant le départ
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={user.preferences.notifications.tripReminders}
                    onValueChange={() => handleToggle('tripReminders')}
                    trackColor={{
                      false: Colors.glassBorder,
                      true: Colors.primaryEnd + '80',
                    }}
                    thumbColor={
                      user.preferences.notifications.tripReminders
                        ? Colors.primaryEnd
                        : Colors.textMuted
                    }
                  />
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* App Info */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <GlassCard style={styles.appInfo}>
              <View style={styles.appInfoContent}>
                <LinearGradient
                  colors={[Colors.primaryStart, Colors.primaryEnd]}
                  style={styles.appLogo}
                >
                  <Ionicons name="train" size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.appName}>Velvet Companion</Text>
                <Text style={styles.appVersion}>Version 1.0.0 (Prototype)</Text>
                <Text style={styles.appTagline}>
                  L'IA qui révolutionne vos voyages en train 🚄
                </Text>
              </View>
            </GlassCard>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  tierBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  email: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tierContainer: {
    marginTop: Spacing.sm,
  },
  tierLabel: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  tierText: {
    ...Typography.small,
    color: '#000',
    fontWeight: '600',
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
  },
  statContent: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  favoriteRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  favoriteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  favoriteText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  favoriteCount: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  favoriteCountText: {
    ...Typography.bodyBold,
    color: Colors.primaryEnd,
  },
  preferencesList: {
    gap: Spacing.sm,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  preferenceLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  preferenceDescription: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glassBorder,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.sm,
    padding: 2,
  },
  segmentButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm - 2,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primaryEnd,
  },
  segmentText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  appInfo: {
    marginTop: Spacing.lg,
  },
  appInfoContent: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  appLogo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  appName: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  appVersion: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  appTagline: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 120,
  },
});
