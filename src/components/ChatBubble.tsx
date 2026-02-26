import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage, Train } from '../services/types';
import { TrainCard } from './TrainCard';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';

interface ChatBubbleProps {
  message: ChatMessage;
  onSuggestionPress?: (suggestion: string) => void;
  onTrainPress?: (train: Train) => void;
}

export function ChatBubble({
  message,
  onSuggestionPress,
  onTrainPress,
}: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={isUser ? FadeInUp.duration(300) : FadeInDown.duration(300)}
      style={[styles.container, isUser && styles.containerUser]}
    >
      {isUser ? (
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.content}</Text>
        </View>
      ) : (
        <View style={styles.assistantContainer}>
          {/* AI Avatar */}
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.aiAvatar}
          >
            <Ionicons name="sparkles" size={12} color="#FFF" />
          </LinearGradient>

          <View style={styles.assistantBubble}>
            <Text style={styles.messageText}>{message.content}</Text>

            {/* Train cards */}
            {message.cards && message.cards.length > 0 && (
              <View style={styles.trainCardsContainer}>
                {message.cards.map((card, index) => (
                  <View key={index} style={styles.cardContainer}>
                    <TrainCard
                      train={card.train}
                      onPress={() => onTrainPress?.(card.train)}
                      compact
                      delay={index * 100}
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {message.suggestions.map((suggestion, index) => (
                  <Pressable
                    key={index}
                    onPress={() => onSuggestionPress?.(suggestion)}
                    style={({ pressed }) => [
                      styles.suggestionChip,
                      pressed && styles.suggestionChipPressed,
                    ]}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      <Text style={[styles.timestamp, isUser && styles.timestampUser]}>
        {formatTimestamp(message.timestamp)}
      </Text>
    </Animated.View>
  );
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Typing indicator component
export function TypingIndicator() {
  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.typingContainer}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.typingAvatar}
      >
        <Ionicons name="sparkles" size={12} color="#FFF" />
      </LinearGradient>
      <View style={styles.typingBubble}>
        <View style={styles.typingContent}>
          <TypingDot delay={0} />
          <TypingDot delay={150} />
          <TypingDot delay={300} />
        </View>
      </View>
    </Animated.View>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const [opacity, setOpacity] = React.useState(0.3);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prev) => (prev === 0.3 ? 1 : 0.3));
    }, 500);

    const timeout = setTimeout(() => {
      // Start the animation after delay
    }, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [delay]);

  return (
    <Animated.View
      style={[styles.typingDot, { opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    maxWidth: '85%',
  },
  containerUser: {
    alignSelf: 'flex-end',
  },
  userBubble: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.lg,
    borderBottomRightRadius: 4,
    padding: Spacing.md,
  },
  userText: {
    ...Typography.body,
    color: '#FFFFFF',
  },
  assistantContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  assistantBubble: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderTopLeftRadius: 4,
    padding: Spacing.md,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  messageText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  timestamp: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 4,
    marginLeft: 36, // Account for avatar
  },
  timestampUser: {
    textAlign: 'right',
    marginLeft: 0,
  },
  trainCardsContainer: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  cardContainer: {
    marginTop: Spacing.xs,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  suggestionChip: {
    backgroundColor: Colors.aiGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  suggestionChipPressed: {
    backgroundColor: Colors.primary + '30',
  },
  suggestionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '500',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  typingAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  typingBubble: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderTopLeftRadius: 4,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  typingContent: {
    flexDirection: 'row',
    gap: 6,
    padding: Spacing.md,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
