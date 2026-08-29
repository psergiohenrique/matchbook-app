import { Send } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { TennisBallLoader } from '@/components/ui/tennis-ball-loader';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCoachMessages, useSendCoachMessage } from '@/queries/use-coach';
import type { CoachMessage } from '@/types/api';

type CoachChatProps = {
  matchId: string;
};

/**
 * Follow-up chat scoped to this one match — see CoachCard for the summary
 * it builds on. Off-topic/cross-match questions are redirected by the
 * backend's system prompt, so replies render as plain assistant text with
 * no special client-side handling for that case.
 */
export function CoachChat({ matchId }: CoachChatProps) {
  const theme = useTheme();
  const messages = useCoachMessages(matchId);
  const sendMessage = useSendCoachMessage(matchId);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const content = draft.trim();
    if (!content || sendMessage.isPending) return;
    setDraft('');
    sendMessage.mutate(content);
  };

  return (
    <Card>
      <ThemedText type="smallBold" themeColor="textSecondary">
        Pergunte ao coach sobre esta partida
      </ThemedText>

      {messages.isLoading ? (
        <View style={styles.loadingRow}>
          <TennisBallLoader size={24} />
        </View>
      ) : (
        <View style={styles.thread}>
          {(messages.data ?? []).map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </View>
      )}

      {sendMessage.isPending ? (
        <View style={styles.loadingRow}>
          <TennisBallLoader size={20} />
        </View>
      ) : null}

      <View style={styles.inputRow}>
        <TextField
          style={styles.input}
          placeholder="Ex: como foi meu saque?"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={handleSend}
          editable={!sendMessage.isPending}
          returnKeyType="send"
        />
        <Pressable
          onPress={handleSend}
          disabled={!draft.trim() || sendMessage.isPending}
          hitSlop={8}
          style={[styles.sendButton, { backgroundColor: theme.accent, opacity: draft.trim() ? 1 : 0.5 }]}>
          <Send size={18} color={theme.accentText} />
        </Pressable>
      </View>
    </Card>
  );
}

function MessageBubble({ message }: { message: CoachMessage }) {
  const theme = useTheme();
  const isUser = message.role === 'USER';

  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      <View
        style={[
          styles.bubble,
          { backgroundColor: isUser ? theme.accent : theme.backgroundElement },
        ]}>
        <ThemedText type="small" style={isUser ? { color: theme.accentText } : undefined}>
          {message.content}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  thread: {
    gap: Spacing.two,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  loadingRow: {
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
