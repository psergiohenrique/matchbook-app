import { z } from 'zod';

export const opponentFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome do adversário'),
  handedness: z.enum(['RIGHT', 'LEFT'], { message: 'Selecione a mão dominante' }),
  playStyle: z.enum(
    ['BASELINER', 'AGGRESSIVE_BASELINER', 'ALL_COURT', 'SERVE_AND_VOLLEY', 'COUNTERPUNCHER', 'PUSHER'],
    { message: 'Selecione o estilo de jogo' },
  ),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  notes: z.string().optional(),
});
export type OpponentFormValues = z.infer<typeof opponentFormSchema>;
