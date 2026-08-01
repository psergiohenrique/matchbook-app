import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { authApi } from '@/api/auth';
import { ApiError } from '@/api/client';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { ResetPasswordFormValues, resetPasswordSchema } from '@/schemas/auth';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!token) {
    return (
      <ScreenScroll>
        <View style={styles.container}>
          <ThemedText type="heading">Link inválido</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Este link de redefinição de senha é inválido ou foi removido.
          </ThemedText>
          <Link href="/(auth)/forgot-password" replace>
            <ThemedText type="linkPrimary">Solicitar novo link</ThemedText>
          </Link>
        </View>
      </ScreenScroll>
    );
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      await authApi.resetPassword({ token, password: values.password });
      router.replace('/(auth)');
    } catch (err) {
      setServerError(
        err instanceof ApiError
          ? 'Link inválido ou expirado. Solicite um novo link de redefinição.'
          : 'Não foi possível redefinir sua senha.',
      );
    }
  };

  return (
    <ScreenScroll keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <ThemedText type="heading">Nova senha</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Escolha uma senha com pelo menos 6 caracteres.
        </ThemedText>

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              label="Nova senha"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <TextField
              label="Confirmar senha"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        {serverError ? (
          <ThemedText type="small" themeColor="loss">
            {serverError}
          </ThemedText>
        ) : null}

        <Button label="Salvar nova senha" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
});
