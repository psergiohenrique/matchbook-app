import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ApiError } from '@/api/client';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { LoadingState } from '@/components/ui/loading-state';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { OptionSheetField } from '@/components/ui/option-sheet';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { surfaceFormOptions } from '@/constants/tennis';
import { useRankings, useUpdateRanking } from '@/queries/use-rankings';
import { RankingFormValues, rankingFormSchema } from '@/schemas/ranking';

export default function EditRankingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const rankings = useRankings();
  const updateRanking = useUpdateRanking();
  const [error, setError] = useState<string | null>(null);
  const ranking = rankings.data?.find((item) => item.id === id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RankingFormValues>({
    resolver: zodResolver(rankingFormSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (!ranking) return;
    reset({ name: ranking.name, surface: ranking.surface });
  }, [ranking, reset]);

  const onSubmit = async (values: RankingFormValues) => {
    setError(null);
    try {
      await updateRanking.mutateAsync({ id, body: values });
      Toast.show({ type: 'success', text1: 'Ranking atualizado' });
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o ranking');
    }
  };

  if (rankings.isLoading) {
    return (
      <ScreenScroll>
        <LoadingState />
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              label="Nome do ranking"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="surface"
          render={({ field }) => (
            <OptionSheetField label="Superfície" options={surfaceFormOptions} value={field.value} onChange={field.onChange} error={errors.surface?.message} />
          )}
        />

        {error ? (
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        ) : null}

        <Button label="Salvar alterações" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
});
