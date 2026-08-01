import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { authApi } from '@/api/auth';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { ScreenScroll } from '@/components/layout/screen-scroll';
import { Spacing } from '@/constants/theme';
import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/schemas/auth';

export default function ForgotPasswordScreen() {
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await authApi.forgotPassword(values);
    } finally {
      // Sempre mostra sucesso para não revelar se o email existe.
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <ScreenScroll>
        <View style={styles.container}>
          <ThemedText type="heading">Verifique seu email</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Se existe uma conta com esse email, você receberá um link para redefinir sua senha. O link expira em 1
            hora.
          </ThemedText>
          <Link href="/(auth)" replace>
            <ThemedText type="linkPrimary">Voltar para o login</ThemedText>
          </Link>
        </View>
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <ThemedText type="heading">Esqueci minha senha</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Informe seu email e enviaremos um link para redefinir sua senha.
        </ThemedText>

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              label="Email"
              placeholder="seu@email.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Button label="Enviar link" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />

        <Link href="/(auth)" replace style={styles.backLink}>
          <ThemedText type="link" themeColor="textSecondary">
            Voltar para o login
          </ThemedText>
        </Link>
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  backLink: {
    alignSelf: 'center',
  },
});
