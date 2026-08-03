import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { ApiError } from '@/api/client';
import { useSession } from '@/auth/session-context';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { registerSchema, RegisterFormValues } from '@/schemas/auth';
import { ScreenScroll } from '@/components/layout/screen-scroll';

export default function RegisterScreen() {
  const session = useSession();
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    try {
      await session.register(values.name, values.email, values.password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar sua conta.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenScroll keyboardShouldPersistTaps="handled">
        <View>
          <ThemedText type="title" style={styles.title}>
            Criar conta
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Comece a registrar suas partidas.
          </ThemedText>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                label="Nome completo"
                placeholder="Seu nome"
                autoCapitalize="words"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                label="Email"
                placeholder="voce@email.com"
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
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                label="Senha"
                placeholder="••••••••"
                secureTextEntry
                autoComplete="password-new"
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
                placeholder="••••••••"
                secureTextEntry
                autoComplete="password-new"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="acceptTerms"
            render={({ field }) => (
              <View>
                <Pressable style={styles.termsRow} onPress={() => field.onChange(!field.value)}>
                  <View
                    style={[
                      styles.checkbox,
                      { backgroundColor: field.value ? theme.lime : theme.backgroundElement, borderColor: theme.border },
                    ]}
                  />
                  <ThemedText type="small" themeColor="textSecondary">
                    Aceito os termos de uso
                  </ThemedText>
                </Pressable>
                {errors.acceptTerms ? (
                  <ThemedText type="small" themeColor="danger">
                    {errors.acceptTerms.message}
                  </ThemedText>
                ) : null}
              </View>
            )}
          />

          {error ? (
            <ThemedText type="small" themeColor="danger">
              {error}
            </ThemedText>
          ) : null}

          <Button label="Criar conta" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
        </View>

        <View style={styles.switchRow}>
          <ThemedText type="small" themeColor="textSecondary">
            Já tem conta?{' '}
          </ThemedText>
          <Link href="/(auth)" replace>
            <ThemedText type="linkPrimary">Entrar</ThemedText>
          </Link>
        </View>
      </ScreenScroll>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  title: {
    fontSize: 26,
  },
  subtitle: {
    marginTop: Spacing.one,
  },
  form: {
    gap: Spacing.three,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.sm / 2,
    borderWidth: 1.5,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
