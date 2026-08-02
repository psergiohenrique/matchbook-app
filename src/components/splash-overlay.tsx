import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ThemedText } from '@/components/themed-text';
import { TennisBallLoader } from '@/components/ui/tennis-ball-loader';
import { useTheme } from '@/hooks/use-theme';

const exitKeyframe = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 1.05 }], easing: Easing.elastic(0.7) },
});

type SplashOverlayProps = {
  /** Flip to true once fonts + session restore have both resolved. */
  ready: boolean;
};

export function SplashOverlay({ ready }: SplashOverlayProps) {
  const theme = useTheme();
  const [animateOut, setAnimateOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (ready && !animateOut) {
      SplashScreen.hideAsync().finally(() => setAnimateOut(true));
    }
  }, [ready, animateOut]);

  if (!visible) return null;

  const content = (
    <View style={styles.content}>
      <TennisBallLoader size={40} />
      <ThemedText type="title" style={{ color: theme.lime }}>
        Matchbook
      </ThemedText>
    </View>
  );

  return animateOut ? (
    <Animated.View
      entering={exitKeyframe.duration(500).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={[styles.overlay, { backgroundColor: theme.hero }]}>
      {content}
    </Animated.View>
  ) : (
    <View style={[styles.overlay, { backgroundColor: theme.hero }]}>{content}</View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
});
