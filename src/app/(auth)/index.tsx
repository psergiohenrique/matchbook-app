import { zodResolver } from '@hookform/resolvers/zod';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { AuthLogoMark } from '@/components/ui/auth-logo-mark';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { ApiError } from '@/api/client';
import { useSession } from '@/auth/session-context';
import { Radius, Spacing } from '@/constants/theme';
import { isExpoGo } from '@/lib/runtime';
import { loginSchema, LoginFormValues } from '@/schemas/auth';
import { ScreenScroll } from '@/components/layout/screen-scroll';

// Importing this module registers a native TurboModule that doesn't exist in Expo Go and
// throws immediately — only require it on a real dev-client/standalone build.
const GoogleSigninButton = isExpoGo
  ? null
  : // eslint-disable-next-line @typescript-eslint/no-require-imports
    (require('@react-native-google-signin/google-signin') as typeof import('@react-native-google-signin/google-signin'))
      .GoogleSigninButton;

export default function LoginScreen() {
  const session = useSession();
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      await session.signIn(values.email, values.password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível autenticar com esse email e senha.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenScroll keyboardShouldPersistTaps="handled">
        <AuthLogoMark />

        <View>
          <ThemedText type="title" style={styles.title}>
            Bem-vindo de volta
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Entre para acompanhar seu jogo.
          </ThemedText>
        </View>

        <View style={styles.form}>
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
                autoComplete="password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
            <ThemedText type="linkPrimary" themeColor="accent">
              Esqueci minha senha
            </ThemedText>
          </Link>

          {error ? (
            <ThemedText type="small" themeColor="danger">
              {error}
            </ThemedText>
          ) : null}

          <Button label="Entrar" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
        </View>

        <SocialSignIn />

        <View style={styles.switchRow}>
          <ThemedText type="small" themeColor="textSecondary">
            Não tem conta?{' '}
          </ThemedText>
          <Link href="/(auth)/register">
            <ThemedText type="linkPrimary">Criar conta</ThemedText>
          </Link>
        </View>
      </ScreenScroll>
    </KeyboardAvoidingView>
  );
}

function SocialSignIn() {
  const session = useSession();
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  const handleGoogle = async () => {
    setLoading('google');
    try {
      await session.signInWithGoogle();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err instanceof ApiError ? err.message : 'Não foi possível entrar com o Google',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleApple = async () => {
    setLoading('apple');
    try {
      await session.signInWithApple();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err instanceof ApiError ? err.message : 'Não foi possível entrar com a Apple',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={styles.socialBlock}>
      <View style={styles.socialDivider}>
        <View style={styles.socialDividerLine} />
        <ThemedText type="small" themeColor="textSecondary">
          ou continue com
        </ThemedText>
        <View style={styles.socialDividerLine} />
      </View>

      {GoogleSigninButton ? (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          disabled={loading !== null}
          onPress={handleGoogle}
          style={styles.googleButton}
        />
      ) : (
        <Button label="Google (requer build de desenvolvimento)" fullWidth disabled onPress={() => {}} />
      )}

      {appleAvailable ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={Radius.md}
          style={styles.appleButton}
          onPress={handleApple}
        />
      ) : null}
    </View>
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
  forgotLink: {
    alignSelf: 'flex-end',
  },
  socialBlock: {
    gap: Spacing.two,
  },
  socialDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  socialDividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  googleButton: {
    width: '100%',
    height: 48,
  },
  appleButton: {
    width: '100%',
    height: 48,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
