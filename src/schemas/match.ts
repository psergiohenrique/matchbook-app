import { z } from 'zod';

const setSchema = z.object({
  self: z.string(),
  opponent: z.string(),
});

export const matchFormSchema = z
  .object({
    tournamentId: z.string().optional(),
    rankingSnapshotId: z.string().optional(),
    opponentProfileId: z.string().optional(),
    playedAt: z.string().min(1, 'Informe a data'),
    surface: z.enum(['HARD', 'CLAY', 'GRASS', 'INDOOR'], { message: 'Selecione a superfície' }),
    format: z.string().min(1, 'Informe o formato'),
    round: z.string().optional(),
    result: z.enum(['WIN', 'LOSS'], { message: 'Selecione o resultado' }),
    sets: z.array(setSchema).length(3),
    focusAreas: z.array(z.string()),
    opponentNotes: z.string().optional(),
    selfAssessment: z.string().optional(),
  })
  .refine((data) => !(data.tournamentId && data.rankingSnapshotId), {
    message: 'Escolha torneio ou ranking, não os dois',
    path: ['rankingSnapshotId'],
  })
  .refine((data) => data.sets.some((set) => set.self.trim() !== '' && set.opponent.trim() !== ''), {
    message: 'Informe o placar de ao menos um set',
    path: ['sets'],
  });
export type MatchFormValues = z.infer<typeof matchFormSchema>;
