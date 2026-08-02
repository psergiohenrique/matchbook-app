import { zodResolver } from '@hookform/resolvers/zod';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link } from 'expo-router';
import { ShieldCheck, Trophy } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { ApiError } from '@/api/client';
import { useSession } from '@/auth/session-context';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { isExpoGo } from '@/lib/runtime';
import { loginSchema, LoginFormValues, registerSchema, RegisterFormValues } from '@/schemas/auth';
import { ScreenScroll } from '@/components/layout/screen-scroll';

// Importing this module registers a native TurboModule that doesn't exist in Expo Go and
// throws immediately — only require it on a real dev-client/standalone build.
const GoogleSigninButton = isExpoGo
  ? null
  : // eslint-disable-next-line @typescript-eslint/no-require-imports
    (require('@react-native-google-signin/google-signin') as typeof import('@react-native-google-signin/google-signin'))
      .GoogleSigninButton;

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const theme = useTheme();

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenScroll keyboardShouldPersistTaps="handled">
        <Card>
          <View style={[styles.tabSwitch, { backgroundColor: theme.backgroundElement }]}>
            <ModeTab label="Entrar" active={mode === 'login'} onPress={() => setMode('login')} />
            <ModeTab label="Criar conta" active={mode === 'register'} onPress={() => setMode('register')} />
          </View>

          {mode === 'login' ? <LoginForm /> : <RegisterForm />}

          <SocialSignIn />
        </Card>

        <View style={[styles.hero, { backgroundColor: theme.hero }]}>
          <ThemedText type="label" style={{ color: theme.lime }}>
            Matchbook Tennis
          </ThemedText>
          <ThemedText type="title" style={[styles.heroTitle, { color: theme.heroText }]}>
            Seu caderno de quadra para entender estilos de adversário
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.heroSub }}>
            Registre partidas, compare desempenho contra perfis diferentes e transforme suas anotações em blocos
            objetivos de treino.
          </ThemedText>
          <View style={styles.heroFeatures}>
            <View style={styles.heroFeatureCard}>
              <Trophy size={18} color={theme.lime} />
              <ThemedText type="smallBold" style={{ color: theme.heroText }}>
                Leitura competitiva
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.heroSub }}>
                Separe partidas por torneio, ranking e superfície para comparar contexto e resultado.
              </ThemedText>
            </View>
            <View style={styles.heroFeatureCard}>
              <ShieldCheck size={18} color={theme.lime} />
              <ThemedText type="smallBold" style={{ color: theme.heroText }}>
                Autenticação segura
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.heroSub }}>
                Login por credenciais com token JWT protegido na API.
              </ThemedText>
            </View>
          </View>
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
        <Button
          label="Google (requer build de desenvolvimento)"
          fullWidth
          disabled
          onPress={() => {}}
        />
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

function ModeTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();

  return (
    <View style={[styles.tab, active && { backgroundColor: theme.hero }]} onTouchEnd={onPress}>
      <ThemedText type="smallBold" style={{ color: active ? theme.heroText : theme.textSecondary }}>
        {label}
      </ThemedText>
    </View>
  );
}

function LoginForm() {
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
    <View style={styles.form}>
      <View>
        <ThemedText type="heading">Acesse sua área de análise</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.formDescription}>
          Use a conta criada para abrir o painel e registrar seus jogos.
        </ThemedText>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            label="Email"
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
            secureTextEntry
            autoComplete="password"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.password?.message}
          />
        )}
      />

      {error ? (
        <ThemedText type="small" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}

      <Button label="Entrar" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />

      <Link href="/(auth)/forgot-password" style={styles.link}>
        <ThemedText type="link" themeColor="textSecondary">
          Esqueci minha senha
        </ThemedText>
      </Link>
    </View>
  );
}

function RegisterForm() {
  const session = useSession();
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
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
    <View style={styles.form}>
      <View>
        <ThemedText type="heading">Crie sua conta</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.formDescription}>
          Ela será usada para proteger seus dados e emitir os tokens de acesso.
        </ThemedText>
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            label="Nome"
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
            secureTextEntry
            autoComplete="password-new"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.password?.message}
          />
        )}
      />

      {error ? (
        <ThemedText type="small" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}

      <Button label="Criar conta" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  hero: {
    borderRadius: Radius.xxl,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  heroFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  heroFeatureCard: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  tabSwitch: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: Spacing.half,
  },
  tab: {
    flex: 1,
    borderRadius: Radius.full,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  form: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  formDescription: {
    marginTop: Spacing.one,
  },
  link: {
    alignSelf: 'center',
  },
  socialBlock: {
    gap: Spacing.two,
    marginTop: Spacing.three,
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
});
