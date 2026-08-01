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
import { Colors, Spacing } from '@/constants/theme';
import { surfaceFormOptions, surfaceLabels } from '@/constants/tennis';
import { formatDate } from '@/lib/date';
import { useCreateRanking, useDeleteRanking, useRankings } from '@/queries/use-rankings';
import { RankingFormValues, rankingFormSchema } from '@/schemas/ranking';

export default function NewRankingScreen() {
  const rankings = useRankings();
  const createRanking = useCreateRanking();
  const deleteRanking = useDeleteRanking();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Excluir ranking', `Remover "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRanking.mutateAsync(id);
            Toast.show({ type: 'success', text1: 'Ranking excluído' });
          } catch (err) {
            Toast.show({
              type: 'error',
              text1: err instanceof ApiError ? err.message : 'Não foi possível excluir o ranking',
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
  } = useForm<RankingFormValues>({
    resolver: zodResolver(rankingFormSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: RankingFormValues) => {
    setError(null);
    try {
      await createRanking.mutateAsync(values);
      Toast.show({ type: 'success', text1: 'Ranking cadastrado' });
      reset({ name: '', surface: values.surface });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o ranking');
    }
  };

  return (
    <ScreenScroll keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <ThemedText type="small" themeColor="textSecondary">
          Registre um snapshot de ranking (ex: um ranking regional ou de circuito) para usar como contexto em partidas.
        </ThemedText>

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              label="Nome do ranking"
              placeholder="Ex: Ranking estadual sub-18"
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
          <ThemedText type="small" themeColor="loss">
            {error}
          </ThemedText>
        ) : null}

        <Button label="Salvar ranking" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
      </View>

      <Card>
        <ThemedText type="heading">Rankings cadastrados</ThemedText>
        {(rankings.data ?? []).length === 0 ? (
          <EmptyState title="Nenhum ranking ainda" />
        ) : (
          <View style={styles.list}>
            {rankings.data?.map((ranking) => (
              <Pressable
                key={ranking.id}
                style={styles.row}
                onPress={() => router.push(`/rankings/${ranking.id}/edit`)}>
                <View style={styles.rowText}>
                  <ThemedText type="bodyMedium">{ranking.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {surfaceLabels[ranking.surface]} · {formatDate(ranking.createdAt)}
                  </ThemedText>
                </View>
                <Pressable onPress={() => handleDelete(ranking.id, ranking.name)} hitSlop={8}>
                  <Trash2 size={18} color={Colors.light.loss} />
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
