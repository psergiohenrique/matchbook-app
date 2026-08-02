import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ApiError } from '@/api/client';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { OptionSheetField } from '@/components/ui/option-sheet';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { surfaceFormOptions, surfaceLabels } from '@/constants/tennis';
import { useTheme } from '@/hooks/use-theme';
import { formatDate } from '@/lib/date';
import { useCreateTournament, useDeleteTournament, useTournaments } from '@/queries/use-tournaments';
import { TournamentFormValues, tournamentFormSchema } from '@/schemas/tournament';

export default function NewTournamentScreen() {
  const theme = useTheme();
  const tournaments = useTournaments();
  const createTournament = useCreateTournament();
  const deleteTournament = useDeleteTournament();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Excluir torneio', `Remover "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTournament.mutateAsync(id);
            Toast.show({ type: 'success', text1: 'Torneio excluído' });
          } catch (err) {
            Toast.show({
              type: 'error',
              text1: err instanceof ApiError ? err.message : 'Não foi possível excluir o torneio',
            });
          }
        },
      },
    ]);
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: { name: '', category: '', city: '', startedAt: '' },
  });

  const onSubmit = async (values: TournamentFormValues) => {
    setError(null);
    const startedAt = new Date(values.startedAt);
    if (Number.isNaN(startedAt.getTime())) {
      setError('Data inválida. Use o formato AAAA-MM-DD.');
      return;
    }

    try {
      await createTournament.mutateAsync({
        name: values.name,
        category: values.category,
        surface: values.surface,
        city: values.city || undefined,
        startedAt: startedAt.toISOString(),
      });
      Toast.show({ type: 'success', text1: 'Torneio cadastrado' });
      reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o torneio');
    }
  };

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
              placeholder="Ex: ITF M15, Regional"
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
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        ) : null}

        <Button label="Salvar torneio" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
      </View>

      <Card>
        <ThemedText type="heading">Torneios cadastrados</ThemedText>
        {(tournaments.data ?? []).length === 0 ? (
          <EmptyState title="Nenhum torneio ainda" />
        ) : (
          <View style={styles.list}>
            {tournaments.data?.map((tournament) => (
              <Pressable
                key={tournament.id}
                style={styles.row}
                onPress={() => router.push(`/tournaments/${tournament.id}/edit`)}>
                <View style={styles.rowText}>
                  <ThemedText type="bodyMedium">{tournament.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {tournament.category} · {surfaceLabels[tournament.surface]} · {formatDate(tournament.startedAt)}
                  </ThemedText>
                </View>
                <Pressable onPress={() => handleDelete(tournament.id, tournament.name)} hitSlop={8}>
                  <Trash2 size={18} color={theme.danger} />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
});
