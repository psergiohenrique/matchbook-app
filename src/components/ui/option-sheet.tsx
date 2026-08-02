import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Check, ChevronDown } from 'lucide-react-native';
import { useCallback, useMemo, useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type SheetOption<T extends string> = {
  label: string;
  value: T;
  description?: string;
};

type OptionSheetFieldProps<T extends string> = {
  label: string;
  value: T | null | undefined;
  options: SheetOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
};

export function OptionSheetField<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Selecionar',
  disabled,
  error,
}: OptionSheetFieldProps<T>) {
  const theme = useTheme();
  const sheetRef = useRef<BottomSheetModal>(null);
  const selected = options.find((option) => option.value === value);
  const maxHeight = useMemo(() => Dimensions.get('window').height * 0.7, []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );

  return (
    <View style={styles.field}>
      <ThemedText type="label" themeColor="textSecondary">
        {label}
      </ThemedText>
      <Pressable
        disabled={disabled}
        onPress={() => sheetRef.current?.present()}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: error ? theme.danger : 'transparent',
          },
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}>
        <ThemedText
          type="default"
          themeColor={selected ? 'text' : 'textSecondary'}
          numberOfLines={1}
          style={styles.triggerLabel}>
          {selected?.label ?? placeholder}
        </ThemedText>
        <ChevronDown size={18} color={theme.textSecondary} />
      </Pressable>
      {error ? (
        <ThemedText type="small" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}

      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        maxDynamicContentSize={maxHeight}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.card }}
        handleIndicatorStyle={{ backgroundColor: theme.border }}>
        <View style={styles.sheetHeader}>
          <ThemedText type="heading">{label}</ThemedText>
        </View>
        <BottomSheetFlatList
          data={options}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onChange(item.value);
                sheetRef.current?.dismiss();
              }}
              style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
              <View style={styles.optionText}>
                <ThemedText type="bodyMedium">{item.label}</ThemedText>
                {item.description ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.description}
                  </ThemedText>
                ) : null}
              </View>
              {item.value === value ? <Check size={18} color={theme.accent} /> : null}
            </Pressable>
          )}
        />
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.one,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  triggerLabel: {
    flex: 1,
    fontFamily: FontFamily.body,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
  sheetHeader: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
});
