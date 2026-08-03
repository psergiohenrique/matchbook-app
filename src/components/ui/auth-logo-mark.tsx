import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Abstract racket-string mark used on the login screen, ported from the Claude Design mockup. */
export function AuthLogoMark({ size = 56 }: { size?: number }) {
  const theme = useTheme();
  const ballSize = Math.round(size * 0.46);

  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, borderRadius: Radius.md, backgroundColor: theme.accent },
      ]}>
      <View
        style={[
          styles.ball,
          { width: ballSize, height: ballSize, borderRadius: ballSize / 2, borderColor: theme.accentText },
        ]}>
        <View
          style={[
            styles.line,
            { width: ballSize, backgroundColor: theme.accentText, top: ballSize * 0.36, left: -ballSize * 0.12 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    borderWidth: 3,
  },
  line: {
    position: 'absolute',
    height: 2,
    transform: [{ rotate: '20deg' }],
  },
});
