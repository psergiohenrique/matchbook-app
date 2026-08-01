import { z } from 'zod';

export const rankingFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome do ranking'),
  surface: z.enum(['HARD', 'CLAY', 'GRASS', 'INDOOR'], { message: 'Selecione a superfície' }),
});
export type RankingFormValues = z.infer<typeof rankingFormSchema>;
