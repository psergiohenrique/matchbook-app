import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { Colors } from '@/constants/theme';

type TennisBallLoaderProps = {
  size?: number;
  color?: string;
};

/**
 * Brand loading spinner, ported from matchbook-old's CSS `tennis-bounce` keyframe
 * (squash-and-stretch bounce) using react-native-reanimated instead of CSS keyframes.
 */
export function TennisBallLoader({ size = 32, color = Colors.light.ballGreen }: TennisBallLoaderProps) {
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  useEffect(() => {
    const bounceHeight = -size * 0.6;
    const bounceEasing = Easing.out(Easing.quad);
    const fallEasing = Easing.in(Easing.quad);

    translateY.value = withRepeat(
      withSequence(
        withTiming(bounceHeight, { duration: 260, easing: bounceEasing }),
        withTiming(0, { duration: 260, easing: fallEasing }),
      ),
      -1,
      false,
    );
    scaleX.value = withRepeat(
      withSequence(
        withTiming(0.92, { duration: 260, easing: bounceEasing }),
        withTiming(1.12, { duration: 90, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 170, easing: fallEasing }),
      ),
      -1,
      false,
    );
    scaleY.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 260, easing: bounceEasing }),
        withTiming(0.85, { duration: 90, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 170, easing: fallEasing }),
      ),
      -1,
      false,
    );
  }, [scaleX, scaleY, size, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scaleX: scaleX.value }, { scaleY: scaleY.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size * 1.5 }]}>
      <Animated.View style={animatedStyle}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={10} fill={color} />
          <Path
            d="M 6.5 3.5 C 14 8, 14 16, 6.5 20.5"
            stroke="#f8f5eb"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M 17.5 3.5 C 10 8, 10 16, 17.5 20.5"
            stroke="#f8f5eb"
            strokeWidth={1.4}
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
