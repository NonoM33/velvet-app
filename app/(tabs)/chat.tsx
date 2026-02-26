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
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ChatBubble, TypingIndicator, GlassCard } from '../../src/components';
import { useStore } from '../../src/store/store';
import { sendChatMessage, detectTrainQuery } from '../../src/services/huggingface';
import { searchTrainsByCity } from '../../src/services/navitia';
import { ChatMessage, Train } from '../../src/services/types';
import { chatSuggestions, parisBordeauxTrains } from '../../src/services/mockData';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

export default function ChatScreen() {
  const { chatMessages, addChatMessage, isTyping, setIsTyping } = useStore();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
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
      // Detect if this is a train search query
      const queryInfo = detectTrainQuery(messageText);

      let responseContent: string;
      let trainCards: { type: 'train'; train: Train }[] | undefined;
      let suggestions: string[] | undefined;

      if (queryInfo.isTrainQuery && queryInfo.origin && queryInfo.destination) {
        // Search for trains
        const trains = await searchTrainsByCity(queryInfo.origin, queryInfo.destination);

        if (trains.length > 0) {
          responseContent = `Voilà ce que j'ai trouvé pour ${queryInfo.origin} → ${queryInfo.destination} ! 🚄\n\nJ'ai ${trains.length} trains disponibles. Voici les meilleures options :`;
          trainCards = trains.slice(0, 3).map((train) => ({
            type: 'train' as const,
            train,
          }));
          suggestions = ['Voir tous les trains', 'Créer une alerte prix', 'Autre trajet'];
        } else {
          responseContent = `Je n'ai pas trouvé de trains directs pour ${queryInfo.origin} → ${queryInfo.destination}. Essaie avec une autre destination ! 🤔`;
          suggestions = ['Paris → Bordeaux', 'Paris → Nantes', 'Paris → Rennes'];
        }
      } else {
        // Use HuggingFace API for general chat
        const conversationHistory = chatMessages
          .filter((m) => m.id !== 'welcome')
          .slice(-6)
          .map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }));

        responseContent = await sendChatMessage(messageText, conversationHistory);

        // Add relevant suggestions based on response
        if (responseContent.toLowerCase().includes('prix') || responseContent.toLowerCase().includes('billet')) {
          suggestions = ['Voir les prix', 'Créer une alerte', 'Meilleur moment pour acheter'];
        } else if (responseContent.toLowerCase().includes('train') || responseContent.toLowerCase().includes('voyage')) {
          suggestions = ['Paris → Bordeaux', 'Paris → Nantes', 'Mes prochains voyages'];
        }
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        cards: trainCards,
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
        content: "Désolé, j'ai rencontré un problème. Réessaie dans quelques instants ! 🔄",
        timestamp: new Date().toISOString(),
        suggestions: chatSuggestions,
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

  const handleTrainPress = (train: Train) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/journey/search-results');
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundLight, Colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <View style={styles.headerContent}>
            <LinearGradient
              colors={[Colors.primaryStart, Colors.primaryEnd]}
              style={styles.aiAvatar}
            >
              <Ionicons name="sparkles" size={20} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>Velvet AI</Text>
              <Text style={styles.headerSubtitle}>
                {isTyping ? 'En train de répondre...' : 'Toujours là pour vous aider'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              useStore.getState().clearChat();
            }}
            style={styles.clearButton}
          >
            <Ionicons name="refresh" size={20} color={Colors.textMuted} />
          </Pressable>
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
            {chatMessages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                onSuggestionPress={handleSuggestionPress}
                onTrainPress={handleTrainPress}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Quick Suggestions (when no messages or few messages) */}
          {chatMessages.length <= 1 && (
            <Animated.View
              entering={FadeInUp.delay(300).duration(400)}
              style={styles.quickSuggestions}
            >
              <Text style={styles.quickSuggestionsTitle}>
                Essayez de demander :
              </Text>
              <View style={styles.suggestionsGrid}>
                {chatSuggestions.map((suggestion, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleSuggestionPress(suggestion)}
                    style={({ pressed }) => [
                      styles.quickSuggestionCard,
                      pressed && styles.quickSuggestionCardPressed,
                    ]}
                  >
                    <GlassCard animated={false} style={styles.suggestionCardInner}>
                      <Ionicons
                        name={
                          index === 0
                            ? 'train'
                            : index === 1
                            ? 'time'
                            : index === 2
                            ? 'cash'
                            : 'help-circle'
                        }
                        size={20}
                        color={Colors.primaryEnd}
                      />
                      <Text style={styles.quickSuggestionText}>{suggestion}</Text>
                    </GlassCard>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <BlurView intensity={40} tint="dark" style={styles.inputBlur}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Demandez-moi n'importe quoi..."
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
                          ? [Colors.primaryStart, Colors.primaryEnd]
                          : [Colors.glassBorder, Colors.glassBorder]
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
            </BlurView>
          </View>
        </KeyboardAvoidingView>

        {/* Bottom spacer for tab bar */}
        <View style={styles.tabBarSpacer} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
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
    padding: Spacing.sm,
  },
  quickSuggestionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  inputBlur: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(30, 30, 50, 0.8)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 52,
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
});
