/**
 * SmartSearchSection Component
 * Collapsible search with animated placeholder and results
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { Button } from '../ui/Button';
import { Train } from '../../services/types';
import { formatTime } from '../../services/navitia';

interface SmartSearchSectionProps {
  expanded: boolean;
  onToggleExpanded: () => void;
  fromCity: string;
  toCity: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onSearch: () => void;
  results: Train[];
  showResults: boolean;
  onBookTrain: (train: Train) => void;
}

export function SmartSearchSection({
  expanded,
  onToggleExpanded,
  fromCity,
  toCity,
  onFromChange,
  onToChange,
  onSearch,
  results,
  showResults,
  onBookTrain,
}: SmartSearchSectionProps) {
  const [placeholder, setPlaceholder] = useState('Paris → Bordeaux');

  useEffect(() => {
    if (expanded) return;

    const placeholders = [
      'Paris → Bordeaux',
      'Lyon → Marseille',
      'Lille → Paris',
      'Nantes → Rennes',
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setPlaceholder(placeholders[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, [expanded]);

  const handleSwapCities = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const temp = fromCity;
    onFromChange(toCity);
    onToChange(temp);
  }, [fromCity, toCity, onFromChange, onToChange]);

  return (
    <View style={styles.container}>
      {/* Search Bar Collapsed */}
      <Pressable onPress={onToggleExpanded}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconWrapper}>
              <Ionicons name="search" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.searchPlaceholder}>
              {expanded ? 'Où allez-vous ?' : placeholder}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={Colors.textTertiary}
            />
          </View>
        </View>
      </Pressable>

      {/* Expanded Search Form */}
      {expanded && (
        <Animated.View
          entering={FadeInDown.duration(200).springify()}
          style={styles.searchExpanded}
        >
          {/* From Field */}
          <View style={styles.searchField}>
            <View style={[styles.fieldIcon, styles.fieldIconFrom]}>
              <Ionicons name="ellipse" size={10} color={Colors.primary} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Départ"
              placeholderTextColor={Colors.textMuted}
              value={fromCity}
              onChangeText={onFromChange}
              autoCapitalize="words"
            />
          </View>

          {/* Swap Button */}
          <Pressable style={styles.swapButton} onPress={handleSwapCities}>
            <Ionicons name="swap-vertical" size={18} color={Colors.primary} />
          </Pressable>

          {/* To Field */}
          <View style={styles.searchField}>
            <View style={[styles.fieldIcon, styles.fieldIconTo]}>
              <Ionicons name="location" size={14} color={Colors.success} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Arrivée"
              placeholderTextColor={Colors.textMuted}
              value={toCity}
              onChangeText={onToChange}
              onSubmitEditing={onSearch}
              returnKeyType="search"
              autoCapitalize="words"
            />
          </View>

          {/* Date Selection (simplified) */}
          <View style={styles.dateRow}>
            <Pressable style={styles.dateChip}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
              <Text style={styles.dateChipText}>Aujourd'hui</Text>
            </Pressable>
            <Pressable style={styles.dateChip}>
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
              <Text style={styles.dateChipText}>Maintenant</Text>
            </Pressable>
            <Pressable style={styles.dateChip}>
              <Ionicons name="person-outline" size={16} color={Colors.primary} />
              <Text style={styles.dateChipText}>1</Text>
            </Pressable>
          </View>

          {/* Search Button */}
          <Button
            title="Rechercher"
            onPress={onSearch}
            variant="primary"
            size="lg"
            fullWidth
            icon="search"
          />
        </Animated.View>
      )}

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <Animated.View
          entering={FadeInUp.duration(300).springify()}
          style={styles.searchResults}
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {results.length} train{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
            </Text>
            <Pressable>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </Pressable>
          </View>

          {results.slice(0, 3).map((train, index) => (
            <Animated.View
              key={train.id}
              entering={SlideInRight.delay(index * 80).springify()}
            >
              <Pressable
                style={styles.resultCard}
                onPress={() => onBookTrain(train)}
              >
                <View style={styles.resultLeft}>
                  <Text style={styles.resultTime}>
                    {formatTime(train.departure.time)}
                  </Text>
                  <Text style={styles.resultDuration}>
                    {Math.floor(train.duration / 60)}h{String(train.duration % 60).padStart(2, '0')}
                  </Text>
                </View>

                <View style={styles.resultTimeline}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineLine} />
                  <View style={[styles.timelineDot, styles.timelineDotFilled]} />
                </View>

                <View style={styles.resultCenter}>
                  <Text style={styles.resultRoute} numberOfLines={1}>
                    {train.departure?.station?.city ?? '—'} → {train.arrival?.station?.city ?? '—'}
                  </Text>
                  <Text style={styles.resultTrain}>{train.trainNumber ?? '—'}</Text>
                </View>

                <View style={styles.resultRight}>
                  {train.originalPrice && train.originalPrice > train.price && (
                    <Text style={styles.resultOriginalPrice}>{train.originalPrice}€</Text>
                  )}
                  <Text style={styles.resultPrice}>{train.price}€</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.textMuted}
                />
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  searchBarContainer: {
    ...Shadows.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.smd,
    gap: Spacing.smd,
  },
  searchIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPlaceholder: {
    ...Typography.callout,
    color: Colors.textTertiary,
    flex: 1,
  },
  searchExpanded: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    gap: Spacing.smd,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.smd,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  fieldIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldIconFrom: {
    backgroundColor: Colors.primaryGhost,
  },
  fieldIconTo: {
    backgroundColor: Colors.successMuted,
  },
  searchInput: {
    ...Typography.callout,
    color: Colors.textPrimary,
    flex: 1,
    padding: 0,
  },
  swapButton: {
    position: 'absolute',
    right: Spacing.md,
    top: 56,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
    zIndex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.smd,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  dateChipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  searchResults: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.smd,
  },
  resultsTitle: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  seeAllText: {
    ...Typography.captionMedium,
    color: Colors.primary,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.smd,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.smd,
  },
  resultLeft: {
    alignItems: 'center',
    minWidth: 48,
  },
  resultTime: {
    ...Typography.bodySemibold,
    color: Colors.navy,
  },
  resultDuration: {
    ...Typography.footnote,
    color: Colors.textMuted,
    marginTop: 2,
  },
  resultTimeline: {
    alignItems: 'center',
    gap: 2,
    height: 40,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  timelineLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: Colors.neutral300,
  },
  timelineDotFilled: {
    backgroundColor: Colors.primary,
  },
  resultCenter: {
    flex: 1,
  },
  resultRoute: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
  resultTrain: {
    ...Typography.footnote,
    color: Colors.textMuted,
    marginTop: 2,
  },
  resultRight: {
    alignItems: 'flex-end',
  },
  resultOriginalPrice: {
    ...Typography.footnote,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  resultPrice: {
    ...Typography.bodySemibold,
    color: Colors.success,
  },
});
