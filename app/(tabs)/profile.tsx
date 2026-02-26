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
import { GlassCard, AnimatedCounter, showToast } from '../../src/components';
import { useStore } from '../../src/store/store';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/constants/theme';
import { demoToasts } from '../../src/services/demoData';

export default function ProfileScreen() {
  const { user, setUser, demoMode, activateDemo } = useStore();

  const handleStartDemo = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    showToast(demoToasts.demoStarted, 'info');
    activateDemo();
  };

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

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
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
            <GlassCard variant="elevated" animated={false}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.email}>{user.email}</Text>
                  <View style={styles.memberBadge}>
                    <Ionicons name="sparkles" size={12} color={Colors.primary} />
                    <Text style={styles.memberText}>Membre Velvet</Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* AI Savings - HERO STAT */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={styles.sectionTitle}>Économies grâce à l'IA</Text>
            <GlassCard variant="ai" animated={false}>
              <View style={styles.aiSavingsCard}>
                <View style={styles.aiSavingsHeader}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.aiSavingsIcon}
                  >
                    <Ionicons name="sparkles" size={28} color="#FFF" />
                  </LinearGradient>
                  <View style={styles.aiSavingsAmount}>
                    <AnimatedCounter
                      value={user.stats.moneySaved}
                      suffix="€"
                      style={styles.savingsValue}
                    />
                    <Text style={styles.savingsLabel}>Économisés au total</Text>
                  </View>
                </View>
                <View style={styles.savingsComparison}>
                  <Text style={styles.comparisonText}>
                    C'est l'équivalent de <Text style={styles.comparisonHighlight}>3 billets Paris-Bordeaux</Text> gratuits !
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Stats Dashboard */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <Text style={styles.sectionTitle}>Vos statistiques</Text>
            <View style={styles.statsGrid}>
              <GlassCard style={styles.statCard} variant="flat" delay={0}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, { backgroundColor: Colors.aiGlow }]}>
                    <Ionicons name="train" size={20} color={Colors.primary} />
                  </View>
                  <AnimatedCounter
                    value={user.stats.totalTrips}
                    style={styles.statValue}
                  />
                  <Text style={styles.statLabel}>Voyages</Text>
                </View>
              </GlassCard>

              <GlassCard style={styles.statCard} variant="flat" delay={100}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, { backgroundColor: Colors.successLight }]}>
                    <Ionicons name="leaf" size={20} color={Colors.success} />
                  </View>
                  <AnimatedCounter
                    value={user.stats.co2Avoided}
                    suffix="kg"
                    style={styles.statValue}
                  />
                  <Text style={styles.statLabel}>CO₂ évité</Text>
                </View>
              </GlassCard>

              <GlassCard style={styles.statCard} variant="flat" delay={200}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, { backgroundColor: Colors.infoLight }]}>
                    <Ionicons name="navigate" size={20} color={Colors.info} />
                  </View>
                  <AnimatedCounter
                    value={Math.round(user.stats.totalDistance / 1000)}
                    suffix="k km"
                    style={styles.statValue}
                  />
                  <Text style={styles.statLabel}>Parcourus</Text>
                </View>
              </GlassCard>
            </View>
          </Animated.View>

          {/* AI Learned Preferences */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text style={styles.sectionTitle}>L'IA a appris que vous préférez</Text>
            <GlassCard variant="default" animated={false}>
              <View style={styles.learnedPrefs}>
                <View style={styles.learnedPref}>
                  <View style={styles.learnedPrefIcon}>
                    <Ionicons name="sunny-outline" size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.learnedPrefText}>Place côté fenêtre</Text>
                </View>
                <View style={styles.learnedPref}>
                  <View style={styles.learnedPrefIcon}>
                    <Ionicons name="volume-mute-outline" size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.learnedPrefText}>Voiture silencieuse</Text>
                </View>
                <View style={styles.learnedPref}>
                  <View style={styles.learnedPrefIcon}>
                    <Ionicons name="time-outline" size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.learnedPrefText}>Départ avant 9h</Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Preferences */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.sectionTitle}>Préférences de voyage</Text>
            <GlassCard variant="default" animated={false}>
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
                      false: Colors.divider,
                      true: Colors.primary + '80',
                    }}
                    thumbColor={
                      user.preferences.quietCoach ? Colors.primary : Colors.textMuted
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
            <Text style={styles.sectionTitle}>Notifications</Text>
            <GlassCard variant="default" animated={false}>
              <View style={styles.preferencesList}>
                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceInfo}>
                    <Ionicons
                      name="pricetag-outline"
                      size={20}
                      color={Colors.textSecondary}
                    />
                    <View>
                      <Text style={styles.preferenceLabel}>Alertes prix IA</Text>
                      <Text style={styles.preferenceDescription}>
                        L'IA vous alerte quand le prix baisse
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={user.preferences.notifications.priceAlerts}
                    onValueChange={() => handleToggle('priceAlerts')}
                    trackColor={{
                      false: Colors.divider,
                      true: Colors.primary + '80',
                    }}
                    thumbColor={
                      user.preferences.notifications.priceAlerts
                        ? Colors.primary
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
                      false: Colors.divider,
                      true: Colors.primary + '80',
                    }}
                    thumbColor={
                      user.preferences.notifications.disruptions
                        ? Colors.primary
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
                      false: Colors.divider,
                      true: Colors.primary + '80',
                    }}
                    thumbColor={
                      user.preferences.notifications.tripReminders
                        ? Colors.primary
                        : Colors.textMuted
                    }
                  />
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Demo Mode */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <Text style={styles.sectionTitle}>Mode Démo</Text>
            <GlassCard variant="ai" animated={false}>
              <View style={styles.demoModeCard}>
                <View style={styles.demoModeHeader}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.demoModeIcon}
                  >
                    <Ionicons name="videocam" size={24} color="#FFF" />
                  </LinearGradient>
                  <View style={styles.demoModeInfo}>
                    <Text style={styles.demoModeTitle}>Présentation Live</Text>
                    <Text style={styles.demoModeDescription}>
                      Lancez une démo interactive avec 5 scénarios impressionnants
                    </Text>
                  </View>
                </View>
                <Pressable
                  style={[styles.demoButton, demoMode && styles.demoButtonDisabled]}
                  onPress={handleStartDemo}
                  disabled={demoMode}
                >
                  <LinearGradient
                    colors={demoMode ? [Colors.textMuted, Colors.textMuted] : [Colors.primary, Colors.primaryDark]}
                    style={styles.demoButtonGradient}
                  >
                    <Text style={styles.demoButtonIcon}>🎬</Text>
                    <Text style={styles.demoButtonText}>
                      {demoMode ? 'Démo en cours...' : 'Lancer la démo'}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </GlassCard>
          </Animated.View>

          {/* App Info */}
          <Animated.View entering={FadeInDown.delay(600).duration(400)}>
            <GlassCard style={styles.appInfo} variant="flat">
              <View style={styles.appInfoContent}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.appLogo}
                >
                  <Ionicons name="train" size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.appName}>Velvet Companion</Text>
                <Text style={styles.appVersion}>Version 1.0.0 (Prototype)</Text>
                <Text style={styles.appTagline}>
                  L'IA qui révolutionne vos voyages en train
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
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.aiGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  memberText: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  // AI Savings Card
  aiSavingsCard: {
    gap: Spacing.md,
  },
  aiSavingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  aiSavingsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSavingsAmount: {
    flex: 1,
  },
  savingsValue: {
    ...Typography.h1,
    color: Colors.success,
    fontWeight: '700',
    fontSize: 40,
  },
  savingsLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  savingsComparison: {
    backgroundColor: Colors.successLight,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  comparisonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  comparisonHighlight: {
    color: Colors.success,
    fontWeight: '600',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
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
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },

  // Learned Preferences
  learnedPrefs: {
    gap: Spacing.sm,
  },
  learnedPref: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  learnedPrefIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.aiGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnedPrefText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },

  // Preferences
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
    backgroundColor: Colors.divider,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.sm,
    padding: 2,
  },
  segmentButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm - 2,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  // Demo Mode
  demoModeCard: {
    gap: Spacing.md,
  },
  demoModeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  demoModeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoModeInfo: {
    flex: 1,
    gap: 4,
  },
  demoModeTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  demoModeDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  demoButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.glow,
  },
  demoButtonDisabled: {
    opacity: 0.7,
  },
  demoButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  demoButtonIcon: {
    fontSize: 20,
  },
  demoButtonText: {
    ...Typography.bodyBold,
    color: '#FFF',
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
