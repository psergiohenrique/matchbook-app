import { z } from 'zod';

export const tournamentFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome do torneio'),
  category: z.string().min(1, 'Informe a categoria'),
  surface: z.enum(['HARD', 'CLAY', 'GRASS', 'INDOOR'], { message: 'Selecione a superfície' }),
  city: z.string().optional(),
  startedAt: z.string().min(1, 'Informe a data de início'),
});
export type TournamentFormValues = z.infer<typeof tournamentFormSchema>;
