import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  multiline?: boolean;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, style, multiline, ...rest },
  ref,
) {
  const theme = useTheme();

  return (
    <View style={styles.field}>
      {label ? (
        <ThemedText type="label" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}
      <TextInput
        ref={ref}
        multiline={multiline}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: error ? theme.loss : 'transparent',
          },
          multiline && styles.multiline,
          style,
        ]}
        {...rest}
      />
      {error ? (
        <ThemedText type="small" themeColor="loss">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one,
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontFamily: FontFamily.body,
    fontSize: 16,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
});
