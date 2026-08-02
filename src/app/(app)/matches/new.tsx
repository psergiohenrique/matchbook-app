import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ApiError } from '@/api/client';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { OptionSheetField } from '@/components/ui/option-sheet';
import { Pill } from '@/components/ui/pill';
import { TagInput } from '@/components/ui/tag-input';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { handednessLabels, matchResultOptions, playStyleLabels, surfaceFormOptions } from '@/constants/tennis';
import { EMPTY_SETS, computeScoreString } from '@/lib/tennis-score';
import { useCreateMatch } from '@/queries/use-matches';
import { useOpponentProfiles } from '@/queries/use-opponents';
import { useRankings } from '@/queries/use-rankings';
import { useTournaments } from '@/queries/use-tournaments';
import { MatchFormValues, matchFormSchema } from '@/schemas/match';
import type { CreateMatchInput } from '@/types/api';

export default function NewMatchScreen() {
  const tournaments = useTournaments();
  const rankings = useRankings();
  const opponentProfiles = useOpponentProfiles();
  const createMatch = useCreateMatch();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      playedAt: '',
      format: '',
      round: '',
      focusAreas: [],
      opponentNotes: '',
      selfAssessment: '',
      sets: EMPTY_SETS,
    },
  });

  const tournamentId = useWatch({ control, name: 'tournamentId' });
  const rankingSnapshotId = useWatch({ control, name: 'rankingSnapshotId' });
  const opponentProfileId = useWatch({ control, name: 'opponentProfileId' });
  const sets = useWatch({ control, name: 'sets' }) ?? EMPTY_SETS;

  const selectedOpponent = opponentProfiles.data?.find((opponent) => opponent.id === opponentProfileId);

  const onSubmit = async (values: MatchFormValues) => {
    setError(null);
    const playedAt = new Date(values.playedAt);
    if (Number.isNaN(playedAt.getTime())) {
      setError('Data inválida. Use o formato AAAA-MM-DD.');
      return;
    }

    const rankingContext = values.rankingSnapshotId
      ? rankings.data?.find((ranking) => ranking.id === values.rankingSnapshotId)?.name
      : undefined;

    const body: CreateMatchInput = {
      tournamentId: values.tournamentId || undefined,
      opponentProfileId: values.opponentProfileId || undefined,
      playedAt: playedAt.toISOString(),
      surface: values.surface,
      format: values.format,
      round: values.round || undefined,
      result: values.result,
      score: computeScoreString(values.sets),
      focusAreas: values.focusAreas,
      opponentNotes: values.opponentNotes || undefined,
      selfAssessment: values.selfAssessment || undefined,
      rankingContext,
    };

    try {
      await createMatch.mutateAsync(body);
      Toast.show({ type: 'success', text1: 'Partida registrada' });
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar a partida');
    }
  };

  return (
    <ScreenScroll keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Controller
          control={control}
          name="opponentProfileId"
          render={({ field }) => (
            <OptionSheetField
              label="Adversário"
              placeholder="Selecionar adversário (opcional)"
              options={(opponentProfiles.data ?? []).map((opponent) => ({ value: opponent.id, label: opponent.name }))}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {selectedOpponent ? (
          <View style={styles.opponentPreview}>
            <ThemedText type="smallBold">Leitura do adversário</ThemedText>
            <View style={styles.pillRow}>
              <Pill label={playStyleLabels[selectedOpponent.playStyle]} tone="gold" />
              <Pill label={handednessLabels[selectedOpponent.handedness]} />
            </View>
            {selectedOpponent.strengths.length > 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                Forças: {selectedOpponent.strengths.join(', ')}
              </ThemedText>
            ) : null}
            {selectedOpponent.weaknesses.length > 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                Fraquezas: {selectedOpponent.weaknesses.join(', ')}
              </ThemedText>
            ) : null}
          </View>
        ) : null}

        <Controller
          control={control}
          name="tournamentId"
          render={({ field }) => (
            <OptionSheetField
              label="Torneio"
              placeholder="Selecionar torneio (opcional)"
              disabled={!!rankingSnapshotId}
              options={(tournaments.data ?? []).map((tournament) => ({ value: tournament.id, label: tournament.name }))}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                setValue('rankingSnapshotId', undefined);
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="rankingSnapshotId"
          render={({ field }) => (
            <OptionSheetField
              label="Ranking"
              placeholder="Selecionar ranking (opcional)"
              disabled={!!tournamentId}
              options={(rankings.data ?? []).map((ranking) => ({ value: ranking.id, label: ranking.name }))}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                setValue('tournamentId', undefined);
              }}
              error={errors.rankingSnapshotId?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="playedAt"
          render={({ field }) => (
            <TextField
              label="Data"
              placeholder="AAAA-MM-DD"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.playedAt?.message}
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
          name="format"
          render={({ field }) => (
            <TextField
              label="Formato"
              placeholder="Ex: Melhor de 3 sets"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.format?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="round"
          render={({ field }) => (
            <TextField label="Fase" placeholder="Ex: Final, Semifinal" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />
          )}
        />
        <Controller
          control={control}
          name="result"
          render={({ field }) => (
            <OptionSheetField label="Resultado" options={matchResultOptions} value={field.value} onChange={field.onChange} error={errors.result?.message} />
          )}
        />

        <View style={styles.setsBlock}>
          <ThemedText type="label" themeColor="textSecondary">
            Placar por set
          </ThemedText>
          {sets.map((_, index) => (
            <View key={index} style={styles.setRow}>
              <ThemedText type="small" style={styles.setLabel}>
                Set {index + 1}
              </ThemedText>
              <Controller
                control={control}
                name={`sets.${index}.self`}
                render={({ field }) => (
                  <TextField style={styles.setInput} keyboardType="number-pad" value={field.value} onChangeText={field.onChange} placeholder="Você" />
                )}
              />
              <ThemedText type="small">×</ThemedText>
              <Controller
                control={control}
                name={`sets.${index}.opponent`}
                render={({ field }) => (
                  <TextField style={styles.setInput} keyboardType="number-pad" value={field.value} onChangeText={field.onChange} placeholder="Adv." />
                )}
              />
            </View>
          ))}
          {errors.sets ? (
            <ThemedText type="small" themeColor="danger">
              {errors.sets.message}
            </ThemedText>
          ) : null}
        </View>

        <Controller
          control={control}
          name="focusAreas"
          render={({ field }) => <TagInput label="Pontos de treino / atenção" value={field.value} onChange={field.onChange} />}
        />
        <Controller
          control={control}
          name="opponentNotes"
          render={({ field }) => (
            <TextField label="Notas sobre o adversário" multiline value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />
          )}
        />
        <Controller
          control={control}
          name="selfAssessment"
          render={({ field }) => (
            <TextField label="Autoavaliação" multiline value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />
          )}
        />

        {error ? (
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        ) : null}

        <Button label="Salvar partida" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  opponentPreview: {
    backgroundColor: 'rgba(16, 39, 31, 0.06)',
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  setsBlock: {
    gap: Spacing.two,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  setLabel: {
    width: 48,
  },
  setInput: {
    flex: 1,
  },
});
