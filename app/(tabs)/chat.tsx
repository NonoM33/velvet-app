import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard, showToast } from '../../src/components';
import { useStore } from '../../src/store/store';
import { sendChatMessage } from '../../src/services/huggingface';
import { ChatMessage } from '../../src/services/types';
import { chatSuggestions } from '../../src/services/mockData';
import { Colors, Spacing, Typography, BorderRadius, Shadows, Layout, Motion } from '../../src/constants/theme';

// Complex query suggestions - chat is for advanced questions
const complexSuggestions = [
  { icon: 'analytics', text: 'Compare les prix sur 2 semaines', category: 'Analyse' },
  { icon: 'calendar', text: 'Planifie mon week-end à Bordeaux', category: 'Planification' },
  { icon: 'bulb', text: 'Meilleur jour pour voyager pas cher', category: 'Conseil' },
  { icon: 'swap-horizontal', text: 'Trajets avec correspondances', category: 'Recherche' },
  { icon: 'time', text: 'Historique des prix Paris-Lyon', category: 'Analyse' },
  { icon: 'people', text: 'Voyage en groupe (4+ personnes)', category: 'Groupe' },
];

export default function ChatScreen() {
  const { chatMessages, addChatMessage, isTyping, setIsTyping } = useStore();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatMessages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    const messageText = inputText.trim();
    setInputText('');
    setIsTyping(true);

    try {
      const conversationHistory = chatMessages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const responseContent = await sendChatMessage(messageText, conversationHistory);

      // Generate contextual suggestions
      let suggestions: string[] | undefined;
      if (responseContent.toLowerCase().includes('prix') || responseContent.toLowerCase().includes('billet')) {
        suggestions = ['Créer une alerte', 'Voir sur le dashboard', 'Comparer d\'autres dates'];
      } else if (responseContent.toLowerCase().includes('train') || responseContent.toLowerCase().includes('voyage')) {
        suggestions = ['Plus de détails', 'Voir mes options', 'Autre question'];
      } else if (responseContent.toLowerCase().includes('bordeaux') || responseContent.toLowerCase().includes('paris')) {
        suggestions = ['Infos destination', 'Météo prévue', 'Activités sur place'];
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        suggestions,
      };

      setIsTyping(false);
      addChatMessage(assistantMessage);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);

      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: "Désolé, j'ai rencontré un problème. Réessaie dans quelques instants!",
        timestamp: new Date().toISOString(),
        suggestions: ['Réessayer', 'Voir le dashboard', 'Autre question'],
      };
      addChatMessage(errorMessage);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setInputText(suggestion);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleQuickAction = (action: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    showToast(`Action: ${action}`, 'info');
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <View style={styles.headerContent}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.aiAvatar}
            >
              <Ionicons name="sparkles" size={20} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>Assistant IA</Text>
              <Text style={styles.headerSubtitle}>
                {isTyping ? 'En train de répondre...' : 'Questions complexes & planification'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              useStore.getState().clearChat();
              showToast('Conversation effacée', 'info');
            }}
            style={styles.clearButton}
          >
            <Ionicons name="refresh" size={20} color={Colors.textMuted} />
          </Pressable>
        </Animated.View>

        {/* Info Banner */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.infoBanner}>
          <Ionicons name="information-circle" size={18} color={Colors.info} />
          <Text style={styles.infoBannerText}>
            Pour les recherches rapides, utilisez le dashboard. Le chat est idéal pour les questions complexes.
          </Text>
        </Animated.View>

        {/* Chat Messages */}
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {chatMessages.map((message, index) => (
              <ChatBubbleSimple
                key={message.id}
                message={message}
                onSuggestionPress={handleSuggestionPress}
                delay={index * 50}
              />
            ))}
            {isTyping && <TypingIndicatorSimple />}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Quick Suggestions (when no messages or few messages) */}
          {chatMessages.length <= 1 && (
            <Animated.View
              entering={FadeInUp.delay(300).duration(400)}
              style={styles.quickSuggestions}
            >
              <Text style={styles.quickSuggestionsTitle}>
                Questions complexes pour l'IA :
              </Text>
              <View style={styles.suggestionsGrid}>
                {complexSuggestions.slice(0, 4).map((suggestion, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleSuggestionPress(suggestion.text)}
                    style={({ pressed }) => [
                      styles.quickSuggestionCard,
                      pressed && styles.quickSuggestionCardPressed,
                    ]}
                  >
                    <View style={styles.suggestionCardInner}>
                      <View style={styles.suggestionIcon}>
                        <Ionicons
                          name={suggestion.icon as keyof typeof Ionicons.glyphMap}
                          size={20}
                          color={Colors.primary}
                        />
                      </View>
                      <View style={styles.suggestionTextContainer}>
                        <Text style={styles.suggestionCategory}>{suggestion.category}</Text>
                        <Text style={styles.quickSuggestionText}>{suggestion.text}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Posez une question complexe..."
                placeholderTextColor={Colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <View style={styles.inputActions}>
                <Pressable style={styles.micButton}>
                  <Ionicons name="mic" size={20} color={Colors.textMuted} />
                </Pressable>
                <Pressable
                  onPress={handleSend}
                  disabled={!inputText.trim()}
                  style={({ pressed }) => [
                    styles.sendButton,
                    !inputText.trim() && styles.sendButtonDisabled,
                    pressed && styles.sendButtonPressed,
                  ]}
                >
                  <LinearGradient
                    colors={
                      inputText.trim()
                        ? [Colors.primary, Colors.primaryDark]
                        : [Colors.divider, Colors.divider]
                    }
                    style={styles.sendButtonGradient}
                  >
                    <Ionicons
                      name="send"
                      size={18}
                      color={inputText.trim() ? '#fff' : Colors.textMuted}
                    />
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Bottom spacer for tab bar */}
        <View style={styles.tabBarSpacer} />
      </SafeAreaView>
    </LinearGradient>
  );
}

// Simplified Chat Bubble (no train cards - those are on dashboard now)
interface ChatBubbleSimpleProps {
  message: ChatMessage;
  onSuggestionPress: (suggestion: string) => void;
  delay?: number;
}

function ChatBubbleSimple({ message, onSuggestionPress, delay = 0 }: ChatBubbleSimpleProps) {
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={[styles.bubbleContainer, isUser && styles.bubbleContainerUser]}
    >
      {!isUser && (
        <View style={styles.bubbleAvatar}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.avatarGradient}
          >
            <Ionicons name="sparkles" size={14} color="#fff" />
          </LinearGradient>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {message.content}
        </Text>

        {/* Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <View style={styles.suggestionsRow}>
            {message.suggestions.map((suggestion, index) => (
              <Pressable
                key={index}
                onPress={() => onSuggestionPress(suggestion)}
                style={styles.suggestionChip}
              >
                <Text style={styles.suggestionChipText}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

function TypingIndicatorSimple() {
  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.bubbleContainer}>
      <View style={styles.bubbleAvatar}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.avatarGradient}
        >
          <Ionicons name="sparkles" size={14} color="#fff" />
        </LinearGradient>
      </View>
      <View style={[styles.bubble, styles.bubbleAssistant, styles.typingBubble]}>
        <View style={styles.typingDots}>
          <View style={[styles.typingDot, styles.typingDot1]} />
          <View style={[styles.typingDot, styles.typingDot2]} />
          <View style={[styles.typingDot, styles.typingDot3]} />
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  clearButton: {
    padding: Spacing.sm,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.infoLight,
    borderRadius: BorderRadius.md,
  },
  infoBannerText: {
    ...Typography.small,
    color: Colors.info,
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
    paddingBottom: 20,
  },
  bottomSpacer: {
    height: 20,
  },
  quickSuggestions: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  quickSuggestionsTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickSuggestionCard: {
    width: '48%',
  },
  quickSuggestionCardPressed: {
    opacity: 0.8,
  },
  suggestionCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.aiGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionCategory: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
  },
  quickSuggestionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  inputContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 52,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xl,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    maxHeight: 100,
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  micButton: {
    padding: Spacing.xs,
  },
  sendButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  tabBarSpacer: {
    height: 90,
  },

  // Chat Bubble Styles
  bubbleContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-end',
  },
  bubbleContainerUser: {
    justifyContent: 'flex-end',
  },
  bubbleAvatar: {
    marginRight: Spacing.sm,
  },
  avatarGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '75%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  bubbleAssistant: {
    backgroundColor: Colors.cardBackground,
    borderBottomLeftRadius: 4,
    ...Shadows.small,
  },
  bubbleText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  suggestionChip: {
    backgroundColor: Colors.aiGlow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  suggestionChipText: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '500',
  },
  typingBubble: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
});
