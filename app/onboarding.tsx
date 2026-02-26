import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  SlideInRight,
  SlideInLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Typography } from '../src/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ONBOARDING_KEY = 'hasSeenOnboarding';

// Screen 1: Le voyage réinventé par l'IA
function Screen1() {
  const sparkleScale = useSharedValue(1);

  useEffect(() => {
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
  }));

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FDF0FF']}
      style={styles.screen}
    >
      <View style={styles.screenContent}>
        <Animated.View
          entering={FadeIn.delay(200).duration(800)}
          style={styles.emojiContainer}
        >
          <Animated.Text style={[styles.bigEmoji, sparkleStyle]}>
            🚄✨
          </Animated.Text>
        </Animated.View>

        <Animated.Text
          entering={SlideInDown.delay(400).springify()}
          style={styles.title}
        >
          Le voyage réinventé{'\n'}par l'IA
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.delay(700).duration(600)}
          style={styles.subtitle}
        >
          Velvet Companion utilise l'intelligence artificielle pour transformer chaque trajet
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

// Screen 2: Achetez au meilleur moment
function Screen2() {
  const barHeights = [0.4, 0.7, 0.5, 0.3, 0.6, 0.45, 0.35];
  const bestIndex = 3;
  const numberValue = useSharedValue(0);
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    numberValue.value = withDelay(800, withTiming(34, { duration: 1500 }));

    const interval = setInterval(() => {
      const currentVal = Math.round(numberValue.value);
      setDisplayNumber(currentVal);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.screenContent}>
        <Animated.Text
          entering={FadeIn.delay(200).duration(600)}
          style={styles.title}
        >
          Achetez au meilleur moment
        </Animated.Text>

        <Animated.View
          entering={FadeIn.delay(400).duration(600)}
          style={styles.chartContainer}
        >
          <View style={styles.chart}>
            {barHeights.map((height, index) => (
              <AnimatedBar
                key={index}
                height={height}
                index={index}
                isBest={index === bestIndex}
              />
            ))}
          </View>

          <Animated.View
            entering={FadeIn.delay(1800).duration(400)}
            style={styles.bestMomentLabel}
          >
            <View style={styles.greenDot} />
            <Text style={styles.bestMomentText}>Meilleur moment</Text>
          </Animated.View>
        </Animated.View>

        <Animated.Text
          entering={FadeIn.delay(600).duration(600)}
          style={styles.bigNumber}
        >
          -{displayNumber}%
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.subtitle}
        >
          Notre IA prédit les prix et vous dit quand acheter
        </Animated.Text>
      </View>
    </View>
  );
}

function AnimatedBar({ height, index, isBest }: { height: number; index: number; isBest: boolean }) {
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = withDelay(
      500 + index * 100,
      withSpring(height * 120, { damping: 12, stiffness: 100 })
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <View style={styles.barWrapper}>
      <Animated.View
        style={[
          styles.bar,
          barStyle,
          isBest && styles.bestBar
        ]}
      />
      {isBest && (
        <Animated.View
          entering={FadeIn.delay(1600).duration(400)}
          style={styles.bestDot}
        />
      )}
    </View>
  );
}

// Screen 3: Perturbation ? On gère.
function Screen3() {
  return (
    <View style={styles.screen}>
      <View style={styles.screenContent}>
        <Animated.Text
          entering={FadeIn.delay(200).duration(600)}
          style={styles.title}
        >
          Perturbation ? On gère.
        </Animated.Text>

        <View style={styles.alertsContainer}>
          <Animated.View
            entering={SlideInRight.delay(500).springify()}
            style={styles.alertCard}
          >
            <Text style={styles.alertEmoji}>⚠️</Text>
            <Text style={styles.alertText}>Retard +25 min</Text>
          </Animated.View>

          <Animated.View
            entering={SlideInLeft.delay(1000).springify()}
            style={styles.solutionCard}
          >
            <Text style={styles.alertEmoji}>🤖</Text>
            <Text style={styles.solutionText}>Alternative trouvée en 2 sec</Text>
          </Animated.View>
        </View>

        <Animated.Text
          entering={FadeInUp.delay(1400).duration(600)}
          style={styles.subtitle}
        >
          En cas de retard, l'IA trouve une alternative instantanément
        </Animated.Text>
      </View>
    </View>
  );
}

// Screen 4: Votre assistant personnel
function Screen4({ onComplete }: { onComplete: () => void }) {
  const [showText, setShowText] = useState(false);
  const dotsOpacity = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      dotsOpacity.value = withTiming(0, { duration: 200 });
      setTimeout(() => setShowText(true), 200);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: dotsOpacity.value,
  }));

  return (
    <View style={styles.screen}>
      <View style={styles.screenContent}>
        <Animated.Text
          entering={FadeIn.delay(200).duration(600)}
          style={styles.title}
        >
          Votre assistant personnel
        </Animated.Text>

        <View style={styles.chatContainer}>
          <Animated.View
            entering={SlideInLeft.delay(600).springify()}
            style={styles.chatBubble}
          >
            {!showText ? (
              <Animated.View style={[styles.typingDots, dotsStyle]}>
                <TypingDot delay={0} />
                <TypingDot delay={150} />
                <TypingDot delay={300} />
              </Animated.View>
            ) : (
              <Animated.Text
                entering={FadeIn.duration(300)}
                style={styles.chatText}
              >
                Paris → Bordeaux samedi ? J'ai trouvé 3 trains à partir de 19€ !
              </Animated.Text>
            )}
          </Animated.View>
        </View>

        <Animated.Text
          entering={FadeInUp.delay(1000).duration(600)}
          style={styles.subtitle}
        >
          Parlez naturellement. L'IA comprend et réserve pour vous.
        </Animated.Text>

        <Animated.View
          entering={FadeInUp.delay(1200).springify()}
          style={styles.ctaContainer}
        >
          <TouchableOpacity
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaText}>Commencer l'aventure 🚄</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        true
      )
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.typingDot, dotStyle]} />;
}

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const insets = useSafeAreaInsets();
  const totalPages = 4;

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      scrollRef.current?.scrollTo({
        x: (currentPage + 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Skip button */}
      {currentPage < totalPages - 1 && (
        <TouchableOpacity
          style={[styles.skipButton, { top: insets.top + Spacing.md }]}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      )}

      {/* Screens */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        <View style={{ width: SCREEN_WIDTH }}><Screen1 /></View>
        <View style={{ width: SCREEN_WIDTH }}><Screen2 /></View>
        <View style={{ width: SCREEN_WIDTH }}><Screen3 /></View>
        <View style={{ width: SCREEN_WIDTH }}><Screen4 onComplete={completeOnboarding} /></View>
      </ScrollView>

      {/* Bottom controls */}
      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + Spacing.lg }]}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Next button (hidden on last page) */}
        {currentPage < totalPages - 1 && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={goToNextPage}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>Suivant</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screen: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.background,
  },
  screenContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  skipButton: {
    position: 'absolute',
    right: Spacing.lg,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
  emojiContainer: {
    marginBottom: Spacing.xl,
  },
  bigEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.navy,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  chartContainer: {
    marginVertical: Spacing.xl,
    alignItems: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 12,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: 32,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.sm,
  },
  bestBar: {
    backgroundColor: Colors.success,
  },
  bestDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
    marginTop: 8,
  },
  bestMomentLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  bestMomentText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
  },
  bigNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: Spacing.md,
  },
  alertsContainer: {
    marginVertical: Spacing.xl,
    width: '100%',
    gap: Spacing.md,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  alertEmoji: {
    fontSize: 24,
  },
  alertText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  solutionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  solutionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
  },
  chatContainer: {
    marginVertical: Spacing.xl,
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  chatBubble: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.sm,
    maxWidth: '90%',
    minHeight: 50,
    justifyContent: 'center',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  chatText: {
    fontSize: 16,
    color: Colors.navy,
    lineHeight: 22,
  },
  ctaContainer: {
    marginTop: Spacing.xl,
    width: '100%',
  },
  ctaButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
  nextButton: {
    width: '100%',
  },
  nextButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
});
