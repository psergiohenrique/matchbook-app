import { z } from 'zod';

const optionalIntInRange = (min: number, max: number) =>
  z
    .string()
    .optional()
    .refine((value) => !value || (/^\d+$/.test(value) && Number(value) >= min && Number(value) <= max), {
      message: `Informe um número entre ${min} e ${max}`,
    });

export const profileFormSchema = z.object({
  dominantHand: z.enum(['RIGHT', 'LEFT']).optional(),
  backhandType: z.string().optional(),
  yearsPlaying: optionalIntInRange(1, 80),
  heightCm: optionalIntInRange(100, 250),
  weightKg: optionalIntInRange(30, 200),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual'),
    newPassword: z.string().min(8, 'Mínimo de 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
