import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { ChatMessage, Train } from '../services/types';
import { TrainCard } from './TrainCard';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

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
        <LinearGradient
          colors={[Colors.primaryStart, Colors.primaryEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.userBubble]}
        >
          <Text style={[styles.messageText, styles.userText]}>
            {message.content}
          </Text>
        </LinearGradient>
      ) : (
        <View style={styles.assistantContainer}>
          <View style={styles.assistantBubble}>
            <BlurView intensity={20} tint="dark" style={styles.blur}>
              <View style={styles.bubbleContent}>
                <Text style={styles.messageText}>{message.content}</Text>

                {/* Train cards */}
                {message.cards &&
                  message.cards.map((card, index) => (
                    <View key={index} style={styles.cardContainer}>
                      <TrainCard
                        train={card.train}
                        onPress={() => onTrainPress?.(card.train)}
                        compact
                        delay={index * 100}
                      />
                    </View>
                  ))}

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
            </BlurView>
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
      <View style={styles.typingBubble}>
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          <View style={styles.typingContent}>
            <TypingDot delay={0} />
            <TypingDot delay={150} />
            <TypingDot delay={300} />
          </View>
        </BlurView>
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
  bubble: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  assistantBubble: {
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  blur: {
    backgroundColor: Colors.glassBackground,
  },
  bubbleContent: {
    padding: Spacing.md,
  },
  messageText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  userText: {
    color: '#FFFFFF',
  },
  timestamp: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 4,
  },
  timestampUser: {
    textAlign: 'right',
  },
  cardContainer: {
    marginTop: Spacing.md,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  suggestionChip: {
    backgroundColor: Colors.primaryStart + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primaryStart + '40',
  },
  suggestionChipPressed: {
    backgroundColor: Colors.primaryStart + '40',
  },
  suggestionText: {
    ...Typography.caption,
    color: Colors.primaryEnd,
  },
  typingContainer: {
    alignSelf: 'flex-start',
    marginVertical: Spacing.xs,
  },
  typingBubble: {
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
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
    backgroundColor: Colors.primaryEnd,
  },
});
