import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import { ApiError } from '@/api/client';
import { useSession } from '@/auth/session-context';
import { HeroHeader } from '@/components/layout/hero-header';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { OptionSheetField } from '@/components/ui/option-sheet';
import { TextField } from '@/components/ui/text-field';
import { handednessOptions } from '@/constants/tennis';
import { useChangePassword, useProfile, useUpdateProfile } from '@/queries/use-profile';
import { ChangePasswordFormValues, changePasswordFormSchema, ProfileFormValues, profileFormSchema } from '@/schemas/profile';
import type { UpdateProfileInput } from '@/types/api';

export default function ProfileScreen() {
  const session = useSession();
  const profile = useProfile();

  return (
    <ScreenScroll keyboardShouldPersistTaps="handled">
      <HeroHeader eyebrow="Perfil" title={session.user?.name ?? 'Seu perfil'} subtitle={session.user?.email} />

      {profile.isLoading ? <LoadingState /> : null}

      {profile.data ? <ProfileForm profile={profile.data} /> : null}

      <ChangePasswordForm />
    </ScreenScroll>
  );
}

function ProfileForm({ profile }: { profile: NonNullable<ReturnType<typeof useProfile>['data']> }) {
  const updateProfile = useUpdateProfile();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      dominantHand: profile.dominantHand ?? undefined,
      backhandType: profile.backhandType ?? '',
      yearsPlaying: profile.yearsPlaying ? String(profile.yearsPlaying) : '',
      heightCm: profile.heightCm ? String(profile.heightCm) : '',
      weightKg: profile.weightKg ? String(profile.weightKg) : '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    const body: UpdateProfileInput = {
      dominantHand: values.dominantHand ?? null,
      backhandType: values.backhandType || null,
      yearsPlaying: values.yearsPlaying ? Number(values.yearsPlaying) : null,
      heightCm: values.heightCm ? Number(values.heightCm) : null,
      weightKg: values.weightKg ? Number(values.weightKg) : null,
    };

    try {
      await updateProfile.mutateAsync(body);
      Toast.show({ type: 'success', text1: 'Perfil atualizado' });
    } catch (err) {
      Toast.show({ type: 'error', text1: err instanceof ApiError ? err.message : 'Não foi possível salvar' });
    }
  };

  return (
    <Card>
      <ThemedText type="heading">Perfil de tênis</ThemedText>
      <Controller
        control={control}
        name="dominantHand"
        render={({ field }) => (
          <OptionSheetField
            label="Mão dominante"
            options={handednessOptions}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="backhandType"
        render={({ field }) => (
          <TextField label="Tipo de backhand" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />
        )}
      />
      <Controller
        control={control}
        name="yearsPlaying"
        render={({ field }) => (
          <TextField
            label="Anos jogando"
            keyboardType="number-pad"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.yearsPlaying?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="heightCm"
        render={({ field }) => (
          <TextField
            label="Altura (cm)"
            keyboardType="number-pad"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.heightCm?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="weightKg"
        render={({ field }) => (
          <TextField
            label="Peso (kg)"
            keyboardType="number-pad"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.weightKg?.message}
          />
        )}
      />
      <Button label="Salvar perfil" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
    </Card>
  );
}

function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setFeedback(null);
    try {
      await changePassword.mutateAsync({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      setFeedback({ type: 'success', message: 'Senha alterada com sucesso' });
      reset();
    } catch (err) {
      const message =
        err instanceof ApiError && err.statusCode === 401 ? 'Senha atual incorreta' : 'Não foi possível alterar a senha';
      setFeedback({ type: 'error', message });
    }
  };

  return (
    <Card>
      <ThemedText type="heading">Alterar senha</ThemedText>
      <Controller
        control={control}
        name="currentPassword"
        render={({ field }) => (
          <TextField
            label="Senha atual"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.currentPassword?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="newPassword"
        render={({ field }) => (
          <TextField
            label="Nova senha"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.newPassword?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <TextField
            label="Confirmar nova senha"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.confirmPassword?.message}
          />
        )}
      />
      {feedback ? (
        <ThemedText type="small" themeColor={feedback.type === 'error' ? 'loss' : 'win'}>
          {feedback.message}
        </ThemedText>
      ) : null}
      <Button label="Atualizar senha" variant="secondary" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
    </Card>
  );
}
