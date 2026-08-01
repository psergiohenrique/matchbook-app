import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TagInputProps = {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

/**
 * Real chip/tag input, replacing matchbook-old's comma-separated free-text fields
 * (strengths/weaknesses/focusAreas) — an explicit UX upgrade over the old app.
 */
export function TagInput({ label, value, onChange, placeholder = 'Adicionar e pressionar enter' }: TagInputProps) {
  const theme = useTheme();
  const [draft, setDraft] = useState('');

  const commit = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft('');
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.field}>
      {label ? (
        <ThemedText type="label" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}
      <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
        {value.map((tag, index) => (
          <View key={`${tag}-${index}`} style={[styles.chip, { backgroundColor: theme.card }]}>
            <ThemedText type="small">{tag}</ThemedText>
            <Pressable hitSlop={8} onPress={() => removeAt(index)}>
              <X size={14} color={Colors.light.textSecondary} />
            </Pressable>
          </View>
        ))}
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={commit}
          onBlur={commit}
          blurOnSubmit={false}
          placeholder={value.length === 0 ? placeholder : undefined}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one,
  },
  container: {
    borderRadius: Radius.md,
    padding: Spacing.two,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  input: {
    flexGrow: 1,
    minWidth: 120,
    fontFamily: FontFamily.body,
    fontSize: 14,
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
  },
});
