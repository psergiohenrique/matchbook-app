import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ApiError } from '@/api/client';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { OptionSheetField } from '@/components/ui/option-sheet';
import { TagInput } from '@/components/ui/tag-input';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { handednessOptions, playStyleOptions } from '@/constants/tennis';
import { useCreateOpponentProfile } from '@/queries/use-opponents';
import { OpponentFormValues, opponentFormSchema } from '@/schemas/opponent';

export default function NewOpponentScreen() {
  const createOpponentProfile = useCreateOpponentProfile();
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OpponentFormValues>({
    resolver: zodResolver(opponentFormSchema),
    defaultValues: { name: '', strengths: [], weaknesses: [], notes: '' },
  });

  const onSubmit = async (values: OpponentFormValues) => {
    setError(null);
    try {
      await createOpponentProfile.mutateAsync({
        name: values.name,
        handedness: values.handedness,
        playStyle: values.playStyle,
        strengths: values.strengths,
        weaknesses: values.weaknesses,
        notes: values.notes || undefined,
      });
      Toast.show({ type: 'success', text1: 'Adversário cadastrado' });
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o adversário');
    }
  };

  return (
    <ScreenScroll keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <ThemedText type="small" themeColor="textSecondary">
          Cadastre um adversário para acompanhar seu histórico contra o estilo dele.
        </ThemedText>

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField label="Nome" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={errors.name?.message} />
          )}
        />
        <Controller
          control={control}
          name="handedness"
          render={({ field }) => (
            <OptionSheetField
              label="Mão dominante"
              options={handednessOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.handedness?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="playStyle"
          render={({ field }) => (
            <OptionSheetField
              label="Estilo de jogo"
              options={playStyleOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.playStyle?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="strengths"
          render={({ field }) => <TagInput label="Pontos fortes" value={field.value} onChange={field.onChange} />}
        />
        <Controller
          control={control}
          name="weaknesses"
          render={({ field }) => <TagInput label="Pontos fracos" value={field.value} onChange={field.onChange} />}
        />
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <TextField label="Notas" multiline value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />
          )}
        />

        {error ? (
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        ) : null}

        <Button label="Salvar adversário" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
});
