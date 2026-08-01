import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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
import { useTournaments, useUpdateTournament } from '@/queries/use-tournaments';
import { TournamentFormValues, tournamentFormSchema } from '@/schemas/tournament';

export default function EditTournamentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tournaments = useTournaments();
  const updateTournament = useUpdateTournament();
  const [error, setError] = useState<string | null>(null);
  const tournament = tournaments.data?.find((item) => item.id === id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: { name: '', category: '', city: '', startedAt: '' },
  });

  useEffect(() => {
    if (!tournament) return;
    reset({
      name: tournament.name,
      category: tournament.category,
      surface: tournament.surface,
      city: tournament.city ?? '',
      startedAt: format(new Date(tournament.startedAt), 'yyyy-MM-dd'),
    });
  }, [tournament, reset]);

  const onSubmit = async (values: TournamentFormValues) => {
    setError(null);
    const startedAt = new Date(values.startedAt);
    if (Number.isNaN(startedAt.getTime())) {
      setError('Data inválida. Use o formato AAAA-MM-DD.');
      return;
    }

    try {
      await updateTournament.mutateAsync({
        id,
        body: {
          name: values.name,
          category: values.category,
          surface: values.surface,
          city: values.city || undefined,
          startedAt: startedAt.toISOString(),
        },
      });
      Toast.show({ type: 'success', text1: 'Torneio atualizado' });
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o torneio');
    }
  };

  if (tournaments.isLoading) {
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
            <TextField label="Nome do torneio" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={errors.name?.message} />
          )}
        />
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <TextField
              label="Categoria"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.category?.message}
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
        <Controller
          control={control}
          name="city"
          render={({ field }) => <TextField label="Cidade" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />}
        />
        <Controller
          control={control}
          name="startedAt"
          render={({ field }) => (
            <TextField
              label="Data de início"
              placeholder="AAAA-MM-DD"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.startedAt?.message}
            />
          )}
        />

        {error ? (
          <ThemedText type="small" themeColor="loss">
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
